import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { content, status, scheduledFor } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Save post to database
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content,
        status: status || 'draft',
        scheduled_for: scheduledFor || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, post })
  } catch (error: any) {
    console.error('Save post error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save post' },
      { status: 500 }
    )
  }
}
