import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { LinkedInClient } from '@/lib/linkedin/client'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postId } = body

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

    // Create LinkedIn client and publish
    console.log('📤 Publishing to LinkedIn...')
    const linkedIn = new LinkedInClient(userData.linkedin_access_token)
    
    const linkedInPost = await linkedIn.createPost(
      post.content,
      userData.linkedin_user_id
    )

    console.log('✅ Published to LinkedIn:', linkedInPost)

    // Update post status
    const { error: updateError } = await supabase
      .from('posts')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString(),
        linkedin_post_id: linkedInPost.id || null
      })
      .eq('id', postId)

    if (updateError) {
      console.error('Error updating post status:', updateError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Post published to LinkedIn successfully!',
      linkedInPostId: linkedInPost.id
    })

  } catch (error: any) {
    console.error('Publish to LinkedIn error:', error)
    
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
