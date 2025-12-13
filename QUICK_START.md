# 🚀 Quick Start - Fix Analytics & Email Issues

## TL;DR - What to Do Now

### Step 1: Check Your Setup (30 seconds)
```bash
npm run check
```
This verifies all environment variables are configured.

### Step 2: Test Email Service (1 minute)
```bash
# Start dev server if not running
npm run dev

# In browser, visit:
http://localhost:3000/api/test-email
```

**Expected:** Should see `"success": true` with an email ID.

### Step 3: Fix Analytics (2 minutes)
The analytics page needs data to show graphs.

**Option A: Create Test Posts**
1. Go to: `http://localhost:3000/dashboard/generate`
2. Generate 3-5 posts
3. Save them (draft or published)
4. Go back to: `http://localhost:3000/dashboard/analytics`

**Option B: Check Console**
1. Go to: `http://localhost:3000/dashboard/analytics`
2. Press F12 (open DevTools)
3. Look for: `📊 Posts fetched: X`
4. If X = 0, you need to create posts (Option A)

### Step 4: Test Workspace Invitations (2 minutes)
1. Go to workspace settings
2. Invite: `delivered@resend.dev` (test email that always works)
3. Check server console for: `✅ Email sent successfully`
4. Check Resend dashboard to see the email

---

## Common Issues

### "Analytics shows no graphs"
**Cause:** No posts in database  
**Fix:** Create some posts first (see Step 3 above)

### "Email test fails"
**Cause:** RESEND_API_KEY not set or invalid  
**Fix:** 
```bash
# Check .env.local has:
RESEND_API_KEY=re_Sxft5Mda_BaxfArV5rHc6zCmm71YMHYqd
```

### "Invitation emails not received"
**Cause:** Using unverified domain  
**Fix:** Use `delivered@resend.dev` for testing (always works)

---

## What Was Fixed

✅ **Analytics Page**
- Added detailed logging to show what data is being fetched
- Better error messages
- Minimum bar height for visibility

✅ **Email Service**
- Support for custom sender email (RESEND_FROM_EMAIL)
- Better error logging
- Test endpoint at /api/test-email

✅ **Developer Tools**
- `npm run check` - Verify environment setup
- DEBUGGING_GUIDE.md - Detailed troubleshooting
- FIXES_APPLIED.md - Complete change documentation

---

## Need More Help?

📖 **Detailed Guides:**
- [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md) - Step-by-step troubleshooting
- [FIXES_APPLIED.md](./FIXES_APPLIED.md) - All changes explained

🔗 **External Resources:**
- [Resend Dashboard](https://resend.com/emails) - Check email delivery
- [Supabase Dashboard](https://supabase.com/dashboard) - Check database

💡 **Quick Commands:**
```bash
npm run check          # Verify setup
npm run dev            # Start server
curl localhost:3000/api/test-email  # Test email
```

---

## Production Deployment

Before deploying to Vercel:

1. ✅ Verify domain in Resend dashboard
2. ✅ Add `RESEND_FROM_EMAIL` to Vercel environment variables
3. ✅ Test with real email addresses
4. ✅ Check Vercel logs for any errors

---

**That's it!** You should now have working analytics and email invitations. 🎉
