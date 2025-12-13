# 🔧 Debugging Guide - Analytics & Email Issues

## Issue 1: Analytics Graphs Not Showing

### Problem
The analytics page shows no graphs or bars are not visible.

### Root Causes
1. **No posts in database** - Graphs need data to display
2. **User not authenticated** - Posts are user-specific
3. **Database connection issue**

### How to Debug

#### Step 1: Check Browser Console
1. Open `/dashboard/analytics`
2. Press F12 to open Developer Tools
3. Look for these console logs:
   ```
   🔍 Fetching analytics for user: [user-id]
   📊 Posts fetched: [number]
   📝 Sample post: [post data]
   📅 Posts by month: {Dec: 2, Nov: 1, ...}
   ```

#### Step 2: Verify You Have Posts
1. Go to `/dashboard` or `/dashboard/drafts`
2. Check if you have any posts created
3. If no posts exist, create some test posts:
   - Go to `/dashboard/generate`
   - Generate a few posts
   - Save them as drafts or publish them

#### Step 3: Check Database
Open Supabase dashboard and run:
```sql
SELECT COUNT(*) FROM posts WHERE user_id = 'your-user-id';
```

### Expected Behavior
- If you have 0 posts: You'll see "No posts yet" message
- If you have posts: Graphs should show bars with minimum 24px height
- Hover over bars to see tooltips with exact counts

---

## Issue 2: Workspace Invitation Emails Not Received

### Problem
When inviting users to a workspace, they don't receive the invitation email.

### Root Causes
1. **Resend API key not configured**
2. **Using test domain without verification**
3. **Email going to spam**
4. **Wrong recipient email**

### How to Debug

#### Step 1: Test Email Service
Visit: `http://localhost:3000/api/test-email`

Or test with your email:
`http://localhost:3000/api/test-email?email=your@email.com`

**Expected Response:**
```json
{
  "success": true,
  "message": "Resend API is working!",
  "emailId": "...",
  "testEmail": "delivered@resend.dev"
}
```

#### Step 2: Check Environment Variables
Verify in `.env.local`:
```bash
RESEND_API_KEY=re_Sxft5Mda_BaxfArV5rHc6zCmm71YMHYqd
```

#### Step 3: Check Server Logs
When sending an invitation, look for these logs:
```
📧 Invite API called for workspace: [workspace-id]
✅ User authenticated: [user-id]
📝 Invite details - Email: [email], Role: [role]
✅ Invitation created successfully: [invitation-id]
📧 Attempting to send invitation email...
📤 Sending from: LinkedAI <onboarding@resend.dev>
📬 Sending to: [recipient-email]
✅ Email sent successfully: [email-id]
```

### Solutions

#### Solution 1: Use Resend Test Email (Recommended for Testing)
The email `delivered@resend.dev` always works with Resend's test domain.

Test invitation:
1. Go to workspace settings
2. Invite: `delivered@resend.dev`
3. Check Resend dashboard for delivery

#### Solution 2: Verify Your Domain (For Production)
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain (e.g., `yourdomain.com`)
3. Add DNS records as shown
4. Wait for verification
5. Update `.env.local`:
   ```
   RESEND_FROM_EMAIL=LinkedAI <noreply@yourdomain.com>
   ```

#### Solution 3: Check Spam Folder
Emails from `onboarding@resend.dev` might go to spam. Check:
- Spam/Junk folder
- Promotions tab (Gmail)
- Other folders

### Testing Checklist

- [ ] RESEND_API_KEY is set in environment variables
- [ ] Test endpoint returns success
- [ ] Server logs show "Email sent successfully"
- [ ] Using `delivered@resend.dev` for testing
- [ ] Checked spam folder
- [ ] Domain verified (for production)

---

## Quick Fixes

### Fix 1: Restart Development Server
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Fix 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check Vercel Environment Variables
If deployed to Vercel:
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Verify `RESEND_API_KEY` is set
5. Redeploy if needed

---

## Common Error Messages

### "RESEND_API_KEY not found"
**Solution:** Add to `.env.local`:
```
RESEND_API_KEY=re_Sxft5Mda_BaxfArV5rHc6zCmm71YMHYqd
```

### "Domain not verified"
**Solution:** Either:
- Use `onboarding@resend.dev` (test domain)
- Verify your domain in Resend dashboard

### "No posts yet"
**Solution:** Create some posts:
1. Go to `/dashboard/generate`
2. Generate and save posts
3. Return to analytics page

---

## Need More Help?

1. Check server console for detailed error logs
2. Check browser console for client-side errors
3. Verify all environment variables are set
4. Test with `delivered@resend.dev` first
5. Check Resend dashboard for email logs

## Useful Links

- [Resend Dashboard](https://resend.com/emails)
- [Resend Documentation](https://resend.com/docs)
- [Supabase Dashboard](https://supabase.com/dashboard)
