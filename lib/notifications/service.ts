// Notification Service
// Helper functions to create notifications from anywhere in the app

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role client for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface CreateNotificationParams {
  userId: string
  type: 'post_published' | 'post_failed' | 'post_scheduled' | 'workspace_invites' | 'member_joined'
  title: string
  message: string
  link?: string
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return { success: false, error }
    }

    return { success: true, notification: data }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error }
  }
}

/**
 * Create notification when post is published
 */
export async function notifyPostPublished(userId: string, postId: string) {
  return createNotification({
    userId,
    type: 'post_published',
    title: 'Post Published Successfully! 🎉',
    message: 'Your LinkedIn post has been published and is now live.',
    link: '/dashboard/analytics'
  })
}

/**
 * Create notification when post fails to publish
 */
export async function notifyPostFailed(userId: string, postId: string, error: string) {
  return createNotification({
    userId,
    type: 'post_failed',
    title: 'Post Failed to Publish ❌',
    message: `Your post could not be published: ${error}`,
    link: '/dashboard/scheduled'
  })
}

/**
 * Create notification when post is scheduled
 */
export async function notifyPostScheduled(userId: string, postId: string, scheduledTime: Date) {
  const formattedTime = scheduledTime.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })

  return createNotification({
    userId,
    type: 'post_scheduled',
    title: 'Post Scheduled 📅',
    message: `Your post has been scheduled for ${formattedTime}`,
    link: '/dashboard/scheduled'
  })
}

/**
 * Create notification when user is invited to workspace
 */
export async function notifyWorkspaceInvite(userId: string, workspaceName: string, workspaceId: string) {
  return createNotification({
    userId,
    type: 'workspace_invites',
    title: 'Workspace Invitation 👥',
    message: `You've been invited to join "${workspaceName}"`,
    link: `/dashboard/workspace/${workspaceId}`
  })
}

/**
 * Create notification when member joins workspace
 */
export async function notifyMemberJoined(userId: string, memberName: string, workspaceName: string, workspaceId: string) {
  return createNotification({
    userId,
    type: 'member_joined',
    title: 'New Member Joined 🎉',
    message: `${memberName} has joined "${workspaceName}"`,
    link: `/dashboard/workspace/${workspaceId}`
  })
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error marking notification as read:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error }
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { success: false, error }
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error getting unread count:', error)
      return { success: false, count: 0, error }
    }

    return { success: true, count: count || 0 }
  } catch (error) {
    console.error('Error getting unread count:', error)
    return { success: false, count: 0, error }
  }
}

/**
 * Delete old notifications (older than 30 days)
 */
export async function cleanupOldNotifications() {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { error } = await supabase
      .from('notifications')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())

    if (error) {
      console.error('Error cleaning up old notifications:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('Error cleaning up old notifications:', error)
    return { success: false, error }
  }
}
