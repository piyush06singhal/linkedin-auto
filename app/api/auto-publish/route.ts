import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { LinkedInClient } from '@/lib/linkedin/client'
import { notifyPostPublished, notifyPostFailed } from '@/lib/notifications/service'

export const dynamic = 'force-dynamic'

// This endpoint checks for posts that should be published and publishes them
// Called by the client-side auto-publish service

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Checking for posts to auto-publish for user:', user.id)

    // Get user's LinkedIn credentials
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('linkedin_access_token, linkedin_user_id')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 })
    }

    if (!userData.linkedin_access_token || !userData.linkedin_user_id) {
      return NextResponse.json({ 
        success: true,
        message: 'LinkedIn not connected',
        published: 0
      })
    }

    // Get posts that should be published now
    const now = new Date().toISOString()
    
    const { data: postsToPublish, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .limit(5) // Process max 5 posts at a time

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

    // Create LinkedIn client
    const linkedIn = new LinkedInClient(userData.linkedin_access_token)

    // Publish each post
    for (const post of postsToPublish) {
      try {
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

        // Create success notification
        await notifyPostPublished(user.id, post.id)

        results.published++

      } catch (error: any) {
        console.error(`❌ Failed to publish post ${post.id}:`, error)
        
        // Create failure notification
        await notifyPostFailed(user.id, post.id, error.message || 'Unknown error')
        
        results.failed++
        results.errors.push({
          postId: post.id,
          error: error.message
        })
      }
    }

    console.log(`📊 Auto-publish complete: ${results.published} published, ${results.failed} failed`)

    return NextResponse.json({
      success: true,
      published: results.published,
      failed: results.failed,
      errors: results.errors
    })

  } catch (error: any) {
    console.error('Auto-publish error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to auto-publish' },
      { status: 500 }
    )
  }
}
