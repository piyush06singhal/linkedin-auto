# Supabase Email Configuration Guide

## Preventing Emails from Going to Spam

### Option 1: Use Custom SMTP (Recommended for Production)

To ensure emails don't go to spam, configure a custom SMTP provider in Supabase:

1. **Go to Supabase Dashboard**
   - Navigate to: Authentication → Email Templates → SMTP Settings

2. **Choose an SMTP Provider** (Pick one):
   - **SendGrid** (Free tier: 100 emails/day)
   - **Mailgun** (Free tier: 5,000 emails/month)
   - **AWS SES** (Very cheap, $0.10 per 1,000 emails)
   - **Postmark** (Free tier: 100 emails/month)

3. **Configure SMTP Settings in Supabase**:
   ```
   Host: smtp.sendgrid.net (or your provider)
   Port: 587
   Username: apikey (for SendGrid)
   Password: YOUR_API_KEY
   Sender Email: noreply@yourdomain.com
   Sender Name: LinkedAI
   ```

### Option 2: Customize Email Templates

Even with default Supabase emails, you can improve deliverability:

1. **Go to**: Authentication → Email Templates
2. **Customize the "Confirm signup" template**:

```html
<h2>Welcome to LinkedAI!</h2>

<p>Thanks for signing up! Click the button below to confirm your email address and get started.</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0A66C2; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Confirm Your Email</a></p>

<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link expires in 24 hours.</p>

<p>If you didn't create an account, you can safely ignore this email.</p>

<hr>
<p style="color: #666; font-size: 12px;">LinkedAI - AI-Powered LinkedIn Automation</p>
```

### Option 3: Disable Email Confirmation (For Testing Only)

⚠️ **Not recommended for production!**

1. Go to: Authentication → Settings
2. Scroll to "Email Confirmation"
3. Toggle OFF "Enable email confirmations"
4. Users will be automatically signed in after signup

### Current Setup

Your app is configured to:
- ✅ Show clear instructions after signup
- ✅ Redirect users to dashboard after email confirmation
- ✅ Handle confirmation errors gracefully
- ✅ Provide helpful tips about checking spam folder

### Testing Email Confirmation

1. Sign up with a real email address
2. Check your inbox (and spam folder)
3. Click the confirmation link
4. You should be redirected to the dashboard

### Troubleshooting

**Email not received?**
- Check spam/junk folder
- Wait 5-10 minutes (sometimes delayed)
- Try with a different email provider (Gmail, Outlook)
- Check Supabase logs: Authentication → Logs

**Confirmation link not working?**
- Link expires after 24 hours
- Can only be used once
- Check browser console for errors

**Still going to spam?**
- Use custom SMTP with a verified domain
- Add SPF and DKIM records to your domain
- Warm up your sending domain gradually

### Recommended: SendGrid Setup (Free)

1. Sign up at https://sendgrid.com
2. Verify your sender email
3. Create an API key
4. Add to Supabase SMTP settings:
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: YOUR_SENDGRID_API_KEY
   Sender: noreply@yourdomain.com
   ```

This will significantly improve email deliverability!
