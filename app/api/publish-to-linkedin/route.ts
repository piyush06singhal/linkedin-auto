import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { LinkedInClient } from '@/lib/linkedin/client'
import { notifyPostPublished, notifyPostFailed } from '@/lib/notifications/service'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let userId: string | undefined
  let postId: string | undefined
  
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    userId = user.id

    const body = await request.json()
    postId = body.postId

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Get the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

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
        error: 'LinkedIn not connected. Please connect your LinkedIn account in Settings.' 
      }, { status: 400 })
    }

    // Check if already published to avoid duplicates
    if (post.status === 'published' && post.linkedin_post_id) {
      console.log('⚠️ Post already published, skipping duplicate publish')
      return NextResponse.json({ 
        success: true, 
        message: 'Post already published to LinkedIn',
        linkedInPostId: post.linkedin_post_id,
        alreadyPublished: true
      })
    }

    // Create LinkedIn client and publish
    console.log('📤 Publishing to LinkedIn...')
    const linkedIn = new LinkedInClient(userData.linkedin_access_token)
    
    const linkedInPost = await linkedIn.createPost(
      post.content,
      userData.linkedin_user_id
    )

    console.log('✅ Published to LinkedIn:', linkedInPost)

    // Update post status (only if not already published)
    const { error: updateError } = await supabase
      .from('posts')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString(),
        linkedin_post_id: linkedInPost.id || null
      })
      .eq('id', postId)
      .eq('status', post.status) // Only update if status hasn't changed

    if (updateError) {
      console.error('Error updating post status:', updateError)
    }

    // Create success notification (only if not a duplicate)
    if (!linkedInPost.isDuplicate) {
      await notifyPostPublished(user.id, postId)
    }

    return NextResponse.json({ 
      success: true, 
      message: linkedInPost.isDuplicate 
        ? 'Post already exists on LinkedIn' 
        : 'Post published to LinkedIn successfully!',
      linkedInPostId: linkedInPost.id,
      isDuplicate: linkedInPost.isDuplicate || false
    })

  } catch (error: any) {
    console.error('Publish to LinkedIn error:', error)
    
    // Check if it's a duplicate post error (LinkedIn returns 429 or specific error message)
    const isDuplicateError = 
      error.message?.includes('DUPLICATE_POST') ||
      error.message?.includes('duplicate') ||
      error.message?.includes('429') ||
      error.statusCode === 429

    if (isDuplicateError) {
      console.log('⚠️ Duplicate post detected - treating as success')
      
      // Update post status if not already published
      if (postId && userId) {
        const supabase = createRouteHandlerClient({ cookies })
        await supabase
          .from('posts')
          .update({ 
            status: 'published',
            published_at: new Date().toISOString()
          })
          .eq('id', postId)
          .eq('user_id', userId)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Post already published to LinkedIn',
        isDuplicate: true
      })
    }
    
    // Create failure notification if we have user and post info (but not for duplicates)
    if (userId && postId) {
      await notifyPostFailed(userId, postId, error.message || 'Unknown error')
    }
    
    // Handle specific LinkedIn API errors
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return NextResponse.json({ 
        error: 'LinkedIn token expired. Please reconnect your LinkedIn account in Settings.' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to publish to LinkedIn' },
      { status: 500 }
    )
  }
}
