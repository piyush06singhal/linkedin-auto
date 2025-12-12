# LinkedIn Automation Platform

Complete AI-powered LinkedIn automation with content generation, scheduling, analytics, and more.

## ✅ ALL CREDENTIALS CONFIGURED

Your `.env.local` is fully set up with:
- ✅ Supabase (Database + Auth)
- ✅ Google Gemini AI (Content generation)
- ✅ LinkedIn API (OAuth + Posting)
- ✅ Resend Email (Notifications)

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
- Go to: https://supabase.com/dashboard/project/dnnzizxurbqvpkuroxxp/sql
- Copy contents of `supabase/schema.sql`
- Paste and click "Run"

### 3. Enable OAuth (Optional)
- Supabase Dashboard → Authentication → Providers
- Enable Google and LinkedIn
- Add Client IDs and Secrets (see INTEGRATION_CHECKLIST.md)

### 4. Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Complete Features

### Pages (16 Total)
1. Landing Page - Features, About, Blog, Contact
2. Login/Signup - Email + Google + LinkedIn OAuth
3. Dashboard - Stats, analytics, recent activity
4. Generate - AI content creation
5. Image Generator - AI image creation
6. Templates - Reusable templates
7. Drafts - Manage drafts
8. Calendar - Schedule posts
9. Scheduled - View scheduled posts
10. Analytics - Performance metrics
11. Leads - Lead generation
12. Viral Predictor - AI post analysis
13. Settings - Account management

### Features
- ✅ AI Content Generation (Google Gemini)
- ✅ AI Image Generation
- ✅ Calendar Scheduling
- ✅ Real LinkedIn Analytics
- ✅ Lead Generation & Tracking
- ✅ Viral Prediction
- ✅ Email Notifications
- ✅ Draft Management
- ✅ Template System
- ✅ Multi-Auth (Email, Google, LinkedIn)

## 📚 Documentation

- `INTEGRATION_CHECKLIST.md` - Complete setup guide
- `supabase/schema.sql` - Database schema
- `.env.local` - All credentials (configured)

## 🛠️ Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Supabase (Database + Auth)
- Google Gemini AI
- LinkedIn API
- Resend (Email)
- Vercel (Hosting)

## 🚀 Deploy to Vercel

1. Go to: https://vercel.com
2. Click "Add New Project"
3. Import: `piyush06singhal/Link_Auto8n`
4. Add environment variables from `.env.local`
5. Click "Deploy"

### Environment Variables Needed:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_AI_API_KEY
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

## 📋 Post-Deployment

1. **Update OAuth URLs:**
   - Google: Add `https://dnnzizxurbqvpkuroxxp.supabase.co/auth/v1/callback`
   - LinkedIn: Add `https://your-app.vercel.app/api/auth/linkedin/callback`

## ✅ Status: 100% Complete & Production Ready!

**Repository:** https://github.com/piyush06singhal/Link_Auto8n
