import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { LinkedInClient } from '@/lib/linkedin/client'

// This endpoint should be called by a cron job (e.g., Vercel Cron or external service)
// It checks for posts that are scheduled to be published and posts them to LinkedIn

export async function GET(request: Request) {
  try {
    // Verify the request is from a cron job (optional but recommended)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase admin client (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all posts that should be published now
    const now = new Date().toISOString()
    const { data: postsToPublish, error: fetchError } = await supabase
      .from('posts')
      .select('*, profiles!inner(linkedin_access_token, linkedin_user_id)')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .limit(50) // Process max 50 posts per run

    if (fetchError) {
      console.error('Error fetching posts:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    if (!postsToPublish || postsToPublish.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No posts to publish',
        published: 0 
      })
    }

    console.log(`📅 Found ${postsToPublish.length} posts to publish`)

    const results = {
      published: 0,
      failed: 0,
      errors: [] as any[]
    }

    // Publish each post
    for (const post of postsToPublish) {
      try {
        const profile = post.profiles

        // Check if user has LinkedIn connected
        if (!profile.linkedin_access_token || !profile.linkedin_user_id) {
          console.log(`⚠️ Post ${post.id}: User hasn't connected LinkedIn`)
          
          // Mark as failed
          await supabase
            .from('posts')
            .update({ 
              status: 'failed',
              error_message: 'LinkedIn account not connected. Please connect your LinkedIn account in Settings.'
            })
            .eq('id', post.id)
          
          results.failed++
          results.errors.push({
            postId: post.id,
            error: 'LinkedIn not connected'
          })
          continue
        }

        // Create LinkedIn client
        const linkedIn = new LinkedInClient(profile.linkedin_access_token)

        // Publish to LinkedIn
        console.log(`📤 Publishing post ${post.id} to LinkedIn...`)
        const linkedInPost = await linkedIn.createPost(
          post.content,
          profile.linkedin_user_id
        )

        console.log(`✅ Post ${post.id} published successfully`)

        // Update post status
        await supabase
          .from('posts')
          .update({ 
            status: 'published',
            published_at: new Date().toISOString(),
            linkedin_post_id: linkedInPost.id
          })
          .eq('id', post.id)

        results.published++

      } catch (error: any) {
        console.error(`❌ Failed to publish post ${post.id}:`, error)
        
        // Mark as failed with error message
        await supabase
          .from('posts')
          .update({ 
            status: 'failed',
            error_message: error.message || 'Failed to publish to LinkedIn'
          })
          .eq('id', post.id)
        
        results.failed++
        results.errors.push({
          postId: post.id,
          error: error.message
        })
      }
    }

    console.log(`📊 Publishing complete: ${results.published} published, ${results.failed} failed`)

    return NextResponse.json({
      success: true,
      published: results.published,
      failed: results.failed,
      errors: results.errors
    })

  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
