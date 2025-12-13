# Email Troubleshooting Guide

## Issue: Workspace Invitations Not Received on Gmail

### Root Cause
Resend's free tier requires **domain verification** before you can send emails to real email addresses (like Gmail). Without verification, emails are blocked.

### Current Status
- ✅ Resend API Key: Configured and valid
- ✅ Email Service: Working
- ❌ Domain: Not verified (using `onboarding@resend.dev`)
- ❌ Gmail Delivery: **Blocked** - requires domain verification

---

## Solutions

### 🚀 Option 1: Verify Your Domain (RECOMMENDED for Production)

**Steps:**
1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the provided DNS records to your domain registrar:
   - TXT record for verification
   - MX records for email delivery
   - DKIM records for authentication
5. Wait 5-10 minutes for DNS propagation
6. Verify the domain in Resend dashboard
7. Update your `.env.local`:
   ```env
   RESEND_FROM_EMAIL=LinkedAI <noreply@yourdomain.com>
   ```

**Benefits:**
- ✅ Send to any email address
- ✅ Professional sender address
- ✅ Better deliverability
- ✅ Production-ready

---

### 🧪 Option 2: Use Resend Test Email (Quick Testing)

**For immediate testing:**
- Use `delivered@resend.dev` as the recipient email
- This always works and appears in Resend dashboard logs
- Perfect for development and testing

**Test it:**
```bash
# Start your dev server
npm run dev

# Visit in browser:
http://localhost:3000/api/test-email?email=delivered@resend.dev
```

---

### 📋 Option 3: Copy Invitation Link (Current Workaround)

**The app now provides a backup method:**
1. Create the invitation (it's saved in database)
2. When prompted, click OK to copy the invitation link
3. Share the link directly via Slack, WhatsApp, etc.
4. Recipient can click the link to accept

**Invitation Link Format:**
```
http://localhost:3000/dashboard/workspace/{workspaceId}?invitation={invitationId}
```

---

### 📧 Option 4: Add Individual Emails (Limited)

**For specific test emails:**
1. Go to [Resend Settings](https://resend.com/settings/emails)
2. Add each Gmail address you want to test
3. Verify each email via confirmation link
4. Now you can send to those addresses

**Limitations:**
- Manual verification required for each email
- Not scalable for production
- Only for testing purposes

---

## Quick Fixes Applied

### ✅ Improved User Feedback
The invite function now:
- Shows clear success/error messages
- Provides invitation link as backup
- Offers to copy link to clipboard
- Explains email status

### ✅ Better Error Handling
The email service now:
- Detects domain verification issues
- Provides helpful error messages
- Logs detailed debugging info
- Suggests solutions

### ✅ Fallback Method
Users can now:
- Always get the invitation link
- Share links manually
- Accept invitations without email

---

## Testing Checklist

### Test Email Service
```bash
# 1. Start dev server
npm run dev

# 2. Test with Resend test email
curl "http://localhost:3000/api/test-email?email=delivered@resend.dev"

# 3. Check Resend dashboard
# Visit: https://resend.com/emails
```

### Test Workspace Invitation
1. Create a workspace
2. Click "Invite Member"
3. Enter `delivered@resend.dev`
4. Check Resend dashboard for email
5. Try copying the invitation link
6. Share link manually

---

## Environment Variables

### Required
```env
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional (After Domain Verification)
```env
RESEND_FROM_EMAIL=LinkedAI <noreply@yourdomain.com>
```

---

## Common Errors

### Error: "Domain not verified"
**Solution:** Verify your domain in Resend or use `onboarding@resend.dev`

### Error: "Invalid API key"
**Solution:** Check `RESEND_API_KEY` in `.env.local`

### Error: "Rate limit exceeded"
**Solution:** Wait a few minutes (free tier has limits)

### Email sent but not received
**Solution:** 
- Check spam folder
- Verify domain in Resend
- Use `delivered@resend.dev` for testing

---

## Production Deployment

### Before Going Live:
1. ✅ Verify your domain in Resend
2. ✅ Update `RESEND_FROM_EMAIL` with your domain
3. ✅ Test with real email addresses
4. ✅ Monitor Resend dashboard for delivery
5. ✅ Set up SPF, DKIM, DMARC records
6. ✅ Consider upgrading Resend plan if needed

### Resend Free Tier Limits:
- 100 emails/day
- 3,000 emails/month
- Domain verification required for real emails

---

## Alternative Email Services

If Resend doesn't work for you:

### SendGrid
- 100 emails/day free
- No domain verification required initially
- Good documentation

### Mailgun
- 100 emails/day free
- Flexible API
- Good for transactional emails

### AWS SES
- Very cheap (pay per email)
- Requires AWS account
- More complex setup

---

## Support

### Resend Support
- Dashboard: https://resend.com
- Docs: https://resend.com/docs
- Status: https://status.resend.com

### Check Logs
```bash
# View server logs for email debugging
# Look for lines starting with 📧, ✅, or ❌
```

---

## Summary

**Current State:**
- Invitations are created successfully ✅
- Invitation links work perfectly ✅
- Email delivery requires domain verification ⚠️

**Recommended Action:**
1. **For Development:** Use `delivered@resend.dev` for testing
2. **For Production:** Verify your domain in Resend
3. **As Backup:** Use the copy link feature to share invitations manually

The app is fully functional - emails are just one delivery method. The invitation link system works regardless of email delivery!
