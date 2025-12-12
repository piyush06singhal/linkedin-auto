import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAll } = body

    if (markAll) {
      // Mark all notifications as read
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 })
      }
    } else if (notificationId) {
      // Mark single notification as read
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Mark read error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to mark as read' },
      { status: 500 }
    )
  }
}
