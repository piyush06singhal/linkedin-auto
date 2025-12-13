# Resend Email Setup - Fix for Gmail Delivery

## Problem
Emails are being sent but not received on Gmail because Resend's free tier has restrictions.

## Solution Options

### Option 1: Use Resend Test Email (Quick Testing)
For testing, use Resend's test email address:
- Email: `delivered@resend.dev`
- This will always work and show in Resend dashboard logs

### Option 2: Verify Your Domain (Production Ready) ⭐ RECOMMENDED
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Add your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend provides to your domain registrar
5. Wait for verification (usually 5-10 minutes)
6. Update `.env.local`:
   ```
   RESEND_FROM_EMAIL=LinkedAI <noreply@yourdomain.com>
   ```

### Option 3: Add Individual Email Addresses (Limited)
1. Go to https://resend.com/settings/emails
2. Add the Gmail addresses you want to test with
3. Verify each email address
4. Now you can send to those specific addresses

### Option 4: Use Alternative Email Service (Free)
Switch to a service with better free tier:

#### A. SendGrid (100 emails/day free)
```bash
npm install @sendgrid/mail
```

#### B. Mailgun (100 emails/day free)
```bash
npm install mailgun.js
```

## Current Status
- ✅ Resend API Key: Valid
- ✅ Email Service: Configured
- ❌ Domain: Not verified (using onboarding@resend.dev)
- ❌ Gmail Delivery: Blocked (domain verification required)

## Quick Fix for Development
Update the workspace invite to show a clear message when email fails:

1. The invitation is still created in the database
2. User can manually share the invitation link
3. Add a "Copy Invitation Link" button

## Recommended Next Steps
1. **For Testing**: Use `delivered@resend.dev` as the test email
2. **For Production**: Verify your domain in Resend
3. **Alternative**: Implement the "Copy Link" feature as a backup

## Testing the Email Service
Run your dev server and visit:
```
http://localhost:3000/api/test-email?email=delivered@resend.dev
```

This will confirm if Resend is working correctly.
