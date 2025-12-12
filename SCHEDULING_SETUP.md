# LinkedIn Auto-Posting Setup Guide

## Overview

This application includes an automatic post scheduling system that publishes your LinkedIn posts at the scheduled time. However, it requires proper setup to work.

## How It Works

1. **User schedules a post** - Posts are saved with `status='scheduled'` and a `scheduled_for` timestamp
2. **User clicks "Publish Now"** - Manually publishes the post when ready
3. **Posts are published to LinkedIn** - Using the LinkedIn API with the user's access token (when OAuth is set up)
4. **Status is updated** - Post status changes to `published`

**Note**: Automatic cron-based publishing has been removed to simplify deployment. Users manually publish scheduled posts using the "Publish Now" button.

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

### 4. Manual Publishing

Instead of automatic cron jobs, users manually publish scheduled posts:

1. Go to the Scheduled page
2. Click "Publish Now" on any scheduled post
3. The post is published to LinkedIn (when OAuth is configured)

This approach:
- ✅ Works on all Vercel plans (no Pro plan needed)
- ✅ Gives users full control over when posts go live
- ✅ Avoids deployment complexity with cron jobs
- ✅ No need for CRON_SECRET or external services

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
```

- **draft**: Post is being worked on
- **scheduled**: Post is queued and ready to publish
- **published**: Post was published to LinkedIn (or marked as published)

## Troubleshooting

### Posts not publishing?

1. Check if LinkedIn is connected (Settings page)
2. Verify environment variables are set
3. Check browser console for errors

### How to check published posts?

```sql
SELECT * FROM posts 
WHERE status = 'published' 
ORDER BY published_at DESC;
```

## Future Enhancements

- [ ] Implement LinkedIn OAuth flow
- [ ] Add actual LinkedIn API posting
- [ ] Show publishing history in UI
- [ ] Support for image attachments
- [ ] Bulk scheduling interface
- [ ] Optional: Add back automatic cron-based publishing (for Pro plans)
