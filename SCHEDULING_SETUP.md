# LinkedIn Auto-Posting Setup Guide

## Overview

This application includes an automatic post scheduling system that publishes your LinkedIn posts at the scheduled time. However, it requires proper setup to work.

## How It Works

1. **User schedules a post** - Posts are saved with `status='scheduled'` and a `scheduled_for` timestamp
2. **Cron job runs every 5 minutes** - Checks for posts that should be published
3. **Posts are published to LinkedIn** - Using the LinkedIn API with the user's access token
4. **Status is updated** - Post status changes to `published` or `failed`

## Setup Requirements

### 1. Database Migration

Run the SQL migration to add required fields:

```bash
# In Supabase SQL Editor, run:
supabase/add_linkedin_fields.sql
```

This adds:
- `linkedin_user_id` to users table
- `error_message` and `failed_at` to posts table
- Updates status constraint to include 'failed'

### 2. Environment Variables

Add these to your `.env.local`:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for cron job

# LinkedIn OAuth (required for auto-posting)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=https://your-domain.com/api/auth/linkedin/callback

# Cron Job Security
CRON_SECRET=your_random_secret_string  # Generate a random string
```

### 3. LinkedIn API Setup

To enable automatic posting, you need to:

1. **Create a LinkedIn App**:
   - Go to https://www.linkedin.com/developers/apps
   - Create a new app
   - Request access to the "Sign In with LinkedIn" and "Share on LinkedIn" products
   - Add your redirect URI: `https://your-domain.com/api/auth/linkedin/callback`

2. **Get API Credentials**:
   - Copy your Client ID and Client Secret
   - Add them to your environment variables

3. **User Authorization**:
   - Users must connect their LinkedIn account in Settings
   - This stores their access token in the database
   - The cron job uses this token to post on their behalf

### 4. Vercel Cron Job

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-posts",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This runs every 5 minutes and checks for posts to publish.

**Note**: Vercel Cron Jobs are only available on Pro plans. For free plans, you can:
- Use an external cron service (like cron-job.org)
- Call the endpoint manually: `GET https://your-domain.com/api/cron/publish-posts`
- Use GitHub Actions to trigger it

### 5. Testing the Cron Job

You can manually trigger the cron job:

```bash
curl -X GET https://your-domain.com/api/cron/publish-posts \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Current Status

⚠️ **LinkedIn OAuth is not yet fully implemented**

The infrastructure is in place, but you need to:
1. Set up a LinkedIn Developer App
2. Implement the OAuth callback handler
3. Add the "Connect LinkedIn" button functionality in Settings

Until then:
- Posts can be scheduled and saved
- They won't be automatically published
- Users will see a warning in the Scheduled page

## Post Status Flow

```
draft → scheduled → published ✅
                 → failed ❌
```

- **draft**: Post is being worked on
- **scheduled**: Post is queued for publishing
- **published**: Post was successfully published to LinkedIn
- **failed**: Post failed to publish (error message stored)

## Troubleshooting

### Posts not publishing?

1. Check if LinkedIn is connected (Settings page)
2. Verify cron job is running (check Vercel logs)
3. Check for failed posts in the database
4. Verify environment variables are set

### How to check failed posts?

```sql
SELECT * FROM posts 
WHERE status = 'failed' 
ORDER BY failed_at DESC;
```

### Manual retry for failed posts

```sql
UPDATE posts 
SET status = 'scheduled', 
    error_message = NULL, 
    failed_at = NULL 
WHERE id = 'post_id_here';
```

## Future Enhancements

- [ ] Implement LinkedIn OAuth flow
- [ ] Add retry logic for failed posts
- [ ] Show publishing history in UI
- [ ] Add email notifications for failed posts
- [ ] Support for image attachments
- [ ] Bulk scheduling interface
