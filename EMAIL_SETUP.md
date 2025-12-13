# Email Setup Guide

## Overview
The app uses **Resend** for sending workspace invitation emails and other notifications.

## Features
- ✅ Workspace invitation emails
- ✅ Beautiful HTML email templates
- ✅ Automatic fallback if email fails
- ✅ Email tracking and delivery status

## Setup Instructions

### 1. Create a Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "LinkedAI Production")
4. Copy the API key (starts with `re_`)

### 3. Add to Environment Variables
Add to your `.env.local` file:
```env
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

For local development:
```env
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Verify Your Domain (Production Only)
For production, you need to verify your domain to send emails from your own domain:

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `linkedai.app`)
4. Add the DNS records to your domain provider
5. Wait for verification (usually takes a few minutes)

Once verified, update the email sender in `lib/email/workspace-invites.ts`:
```typescript
from: 'LinkedAI <noreply@yourdomain.com>'
```

## Testing

### Test Email Sending
1. Create a workspace
2. Invite a user with your email address
3. Check your inbox for the invitation email
4. Check spam folder if not received

### Development Mode
If `RESEND_API_KEY` is not set:
- Emails won't be sent
- Invitation will still be created in database
- Email content will be logged to console for testing

## Email Templates

### Workspace Invitation Email
Located in: `lib/email/workspace-invites.ts`

Features:
- Beautiful gradient header
- Clear call-to-action button
- Role information
- Expiration notice
- Plain text fallback

## Resend Free Tier Limits
- ✅ 100 emails per day
- ✅ 3,000 emails per month
- ✅ All features included
- ✅ No credit card required

For higher limits, upgrade to a paid plan.

## Troubleshooting

### Emails Not Sending
1. **Check API Key**: Make sure `RESEND_API_KEY` is set correctly
2. **Check Logs**: Look for email sending logs in the console
3. **Verify Domain**: In production, make sure your domain is verified
4. **Check Spam**: Emails might be in spam folder

### Email Delivery Issues
1. **SPF/DKIM**: Make sure DNS records are set up correctly
2. **From Address**: Use a verified domain in production
3. **Rate Limits**: Free tier has 100 emails/day limit

### Testing Locally
1. Use your own email address for testing
2. Check console logs for email content
3. Use Resend's test mode if available

## Production Checklist
- [ ] Resend account created
- [ ] API key added to environment variables
- [ ] Domain verified (for custom sender)
- [ ] DNS records configured
- [ ] Test email sent successfully
- [ ] Spam folder checked
- [ ] Email tracking enabled

## Alternative: Development Without Email
If you don't want to set up email for development:
1. Leave `RESEND_API_KEY` empty
2. Invitations will still be created in database
3. Users can access workspaces directly via URL
4. Email content will be logged to console

## Support
- Resend Documentation: https://resend.com/docs
- Resend Support: https://resend.com/support
- API Status: https://status.resend.com

## Cost Estimate
- **Free Tier**: 100 emails/day (sufficient for most small teams)
- **Pro Plan**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing for higher volumes

For a typical workspace with 10 users sending 5 invitations per day:
- Daily emails: ~5
- Monthly emails: ~150
- **Recommended**: Free tier is sufficient
