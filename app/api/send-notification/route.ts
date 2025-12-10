import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createEmailNotifier } from '@/lib/email/notifications'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    const emailNotifier = createEmailNotifier()
    let result = false

    switch (type) {
      case 'post-published':
        result = await emailNotifier.notifyPostPublished(
          user.email!,
          data.postContent,
          data.linkedInUrl
        )
        break

      case 'post-scheduled':
        result = await emailNotifier.notifyPostScheduled(
          user.email!,
          data.scheduledDate,
          data.postContent
        )
        break

      case 'weekly-summary':
        result = await emailNotifier.sendWeeklySummary(
          user.email!,
          data.stats
        )
        break

      case 'goal-achieved':
        result = await emailNotifier.notifyGoalAchieved(
          user.email!,
          data.goalType,
          data.value
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: result })
  } catch (error: any) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send notification' },
      { status: 500 }
    )
  }
}
