# Notification System - Complete Documentation

## Overview
The notification system provides real-time updates to users about their LinkedIn activity, including post publishing, scheduling, failures, and workspace events.

## ✅ Components Implemented

### 1. Database Schema (`supabase/notifications_schema.sql`)
- **notifications table**: Stores all user notifications
  - Fields: id, user_id, type, title, message, link, read, created_at
  - Indexes for performance on user_id, read status, and created_at
  - RLS policies for user data security

- **notification_preferences table**: User notification settings
  - Fields: email_notifications, push_notifications, post_published, post_failed, post_scheduled, workspace_invites, member_joined
  - Auto-creates default preferences for new users via trigger

### 2. API Routes

#### `/api/notifications/list` (GET)
- Fetches user notifications with pagination
- Supports filtering by unread status
- Returns unread count

#### `/api/notifications/mark-read` (POST)
- Marks single notification as read
- Marks all notifications as read (bulk action)

#### `/api/notifications/preferences` (GET/PUT)
- Fetches user notification preferences
- Updates notification preferences
- Auto-creates defaults if not exist

### 3. UI Components

#### `components/NotificationDropdown.tsx`
- Bell icon with unread count badge
- Dropdown showing recent 10 notifications
- Click to mark as read and navigate
- Auto-refreshes every 30 seconds
- "Mark all as read" functionality

#### `app/dashboard/notifications/page.tsx`
- Full notification history page
- Filter by all/unread
- Mark individual or all as read
- Click to navigate to related content
- Time ago formatting
- Empty states for no notifications

#### `app/dashboard/notifications/preferences/page.tsx`
- Toggle notification types on/off
- General settings (email, push)
- Post notifications (published, failed, scheduled)
- Workspace notifications (invites, member joined)
- Save preferences with success feedback

### 4. Notification Service (`lib/notifications/service.ts`)

Helper functions to create notifications from anywhere in the app:

- `createNotification()` - Generic notification creator
- `notifyPostPublished()` - Post published successfully
- `notifyPostFailed()` - Post failed to publish
- `notifyPostScheduled()` - Post scheduled for later
- `notifyWorkspaceInvite()` - User invited to workspace
- `notifyMemberJoined()` - Member joined workspace
- `markNotificationAsRead()` - Mark single as read
- `markAllNotificationsAsRead()` - Mark all as read
- `getUnreadCount()` - Get unread count
- `cleanupOldNotifications()` - Delete notifications older than 30 days

### 5. Integration Points

Notifications are automatically created in these scenarios:

#### Post Publishing (`app/api/publish-to-linkedin/route.ts`)
- ✅ Success notification when post is published
- ❌ Failure notification if publishing fails

#### Auto-Publishing (`app/api/auto-publish/route.ts`)
- ✅ Success notification for each auto-published post
- ❌ Failure notification for each failed post

#### Post Scheduling (`app/api/schedule-post/route.ts`)
- 📅 Notification when post is scheduled

## Notification Types

| Type | Icon | Title | When Triggered |
|------|------|-------|----------------|
| `post_published` | ✅ | Post Published Successfully! | Post goes live on LinkedIn |
| `post_failed` | ❌ | Post Failed to Publish | Publishing error occurs |
| `post_scheduled` | 📅 | Post Scheduled | Post scheduled for future |
| `workspace_invites` | 👥 | Workspace Invitation | User invited to workspace |
| `member_joined` | 🎉 | New Member Joined | Member joins workspace |

## Features

### Real-time Updates
- Dropdown polls every 30 seconds for new notifications
- Unread count badge on bell icon
- Auto-refresh on page load

### User Preferences
- Granular control over notification types
- Email notifications (future enhancement)
- Push notifications (in-app)
- Per-event type toggles

### Smart Navigation
- Notifications include links to relevant pages
- Click notification to mark as read and navigate
- Deep links to analytics, scheduled posts, workspaces

### Data Management
- RLS policies ensure users only see their notifications
- Automatic cleanup of old notifications (30+ days)
- Efficient indexing for fast queries

## Usage Examples

### Creating a Notification
```typescript
import { notifyPostPublished } from '@/lib/notifications/service'

// After publishing a post
await notifyPostPublished(userId, postId)
```

### Checking Preferences
```typescript
const response = await fetch('/api/notifications/preferences')
const { preferences } = await response.json()

if (preferences.post_published) {
  // User wants post published notifications
}
```

### Marking as Read
```typescript
// Single notification
await fetch('/api/notifications/mark-read', {
  method: 'POST',
  body: JSON.stringify({ notificationId: 'uuid' })
})

// All notifications
await fetch('/api/notifications/mark-read', {
  method: 'POST',
  body: JSON.stringify({ markAll: true })
})
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Setup

Run the SQL schema in Supabase:
```bash
# Execute supabase/notifications_schema.sql in Supabase SQL Editor
```

This will create:
- notifications table
- notification_preferences table
- Indexes for performance
- RLS policies for security
- Triggers for auto-creating preferences
- Helper functions for creating notifications

## Future Enhancements

- [ ] Email notifications via Resend
- [ ] Browser push notifications
- [ ] Notification sound effects
- [ ] Notification grouping (e.g., "3 posts published")
- [ ] Notification search/filter
- [ ] Export notification history
- [ ] Webhook notifications for integrations

## Testing

To test the notification system:

1. **Schedule a post** - Should create a "Post Scheduled" notification
2. **Publish a post manually** - Should create a "Post Published" notification
3. **Let auto-publish run** - Should create notifications for published/failed posts
4. **Check the dropdown** - Should show recent notifications with unread count
5. **Visit notifications page** - Should show full history
6. **Update preferences** - Should save and persist settings

## Troubleshooting

### Notifications not appearing
- Check RLS policies are enabled
- Verify user is authenticated
- Check browser console for API errors
- Ensure notification_preferences exist for user

### Unread count incorrect
- Clear browser cache
- Check database for duplicate notifications
- Verify mark-read API is working

### Preferences not saving
- Check SUPABASE_SERVICE_ROLE_KEY is set
- Verify API route has correct permissions
- Check database connection

## Status: ✅ COMPLETE

All notification system components are fully implemented and integrated:
- ✅ Database schema with RLS
- ✅ API routes for CRUD operations
- ✅ Notification dropdown component
- ✅ Full history page
- ✅ Preferences page
- ✅ Service helper functions
- ✅ Integration with publish/schedule flows
- ✅ Auto-refresh and real-time updates
