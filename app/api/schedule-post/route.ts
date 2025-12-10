import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postId, scheduledFor } = body

    if (!postId || !scheduledFor) {
      return NextResponse.json(
        { error: 'Post ID and scheduled time required' },
        { status: 400 }
      )
    }

    // Update post with scheduled time
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        status: 'scheduled',
        scheduled_for: scheduledFor,
      })
      .eq('id', postId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to schedule post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, post })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
