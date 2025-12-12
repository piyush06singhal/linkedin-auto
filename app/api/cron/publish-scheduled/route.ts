import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { LinkedInClient } from '@/lib/linkedin/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// This endpoint is called by Vercel Cron every 5 minutes
// It checks for posts that should be published and posts them to LinkedIn

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron (optional security)
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log('⚠️ Unauthorized cron request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('⏰ Cron job started - checking for scheduled posts...')

    // Create Supabase admin client (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get all posts that should be published now
    const now = new Date().toISOString()
    
    const { data: postsToPublish, error: fetchError } = await supabase
      .from('posts')
      .select(`
        *,
        users!inner (
          linkedin_access_token,
          linkedin_user_id
        )
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .limit(20) // Process max 20 posts per run

    if (fetchError) {
      console.error('❌ Error fetching posts:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    if (!postsToPublish || postsToPublish.length === 0) {
      console.log('✅ No posts to publish')
      return NextResponse.json({ 
        success: true, 
        message: 'No posts to publish',
        published: 0,
        timestamp: new Date().toISOString()
      })
    }

    console.log(`📅 Found ${postsToPublish.length} posts to publish`)

    const results = {
      published: 0,
      failed: 0,
      skipped: 0,
      errors: [] as any[]
    }

    // Publish each post
    for (const post of postsToPublish) {
      try {
        const userData = post.users

        // Check if user has LinkedIn connected
        if (!userData?.linkedin_access_token || !userData?.linkedin_user_id) {
          console.log(`⚠️ Post ${post.id}: User hasn't connected LinkedIn - skipping`)
          
          // Don't mark as failed, just skip
          results.skipped++
          continue
        }

        // Create LinkedIn client
        const linkedIn = new LinkedInClient(userData.linkedin_access_token)

        // Publish to LinkedIn
        console.log(`📤 Publishing post ${post.id} to LinkedIn...`)
        const linkedInPost = await linkedIn.createPost(
          post.content,
          userData.linkedin_user_id
        )

        console.log(`✅ Post ${post.id} published successfully`)

        // Update post status
        await supabase
          .from('posts')
          .update({ 
            status: 'published',
            published_at: new Date().toISOString(),
            linkedin_post_id: linkedInPost.id || null
          })
          .eq('id', post.id)

        results.published++

      } catch (error: any) {
        console.error(`❌ Failed to publish post ${post.id}:`, error)
        
        // Check if it's a token error
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.log(`🔑 Token expired for post ${post.id} - keeping as scheduled`)
          results.skipped++
        } else {
          // Mark as failed with error message
          await supabase
            .from('posts')
            .update({ 
              status: 'scheduled', // Keep as scheduled so user can retry
              error_message: error.message || 'Failed to publish to LinkedIn'
            })
            .eq('id', post.id)
          
          results.failed++
        }
        
        results.errors.push({
          postId: post.id,
          error: error.message
        })
      }
    }

    console.log(`📊 Publishing complete: ${results.published} published, ${results.failed} failed, ${results.skipped} skipped`)

    return NextResponse.json({
      success: true,
      published: results.published,
      failed: results.failed,
      skipped: results.skipped,
      errors: results.errors,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Cron job error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
