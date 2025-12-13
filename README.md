# LinkedAI - AI-Powered LinkedIn Automation Platform

Complete LinkedIn automation platform with AI content generation, scheduling, analytics, workspace collaboration, and more.

## ✨ Features

### 🤖 AI-Powered Content
- **AI Content Generation** - Generate engaging LinkedIn posts with Google Gemini AI
- **AI Image Generation** - Create professional images for your posts
- **Viral Predictor** - AI analysis to predict post performance
- **Content Ideas** - Get AI-suggested topics and ideas

### 📅 Scheduling & Publishing
- **Calendar View** - Visual scheduling interface
- **Auto-Publishing** - Automatic posting to LinkedIn
- **Draft Management** - Save and edit drafts
- **Template System** - Reusable content templates

### 📊 Analytics & Insights
- **Real-time Analytics** - Track post performance
- **LinkedIn Sync** - Automatic analytics synchronization
- **Engagement Metrics** - Likes, comments, shares, impressions
- **Performance Trends** - Historical data and insights

### 👥 Workspace Collaboration
- **Team Workspaces** - Collaborate with your team
- **Role-Based Access** - Owner, Admin, Editor, Viewer roles
- **Member Invitations** - Invite team members via email
- **Workspace Management** - Manage multiple workspaces

### 🔔 Notifications
- **Real-time Notifications** - Stay updated on important events
- **Email Notifications** - Workspace invitations and updates
- **Notification Preferences** - Customize what you receive

### 🔐 Authentication
- **Email/Password** - Traditional authentication
- **Google OAuth** - Sign in with Google
- **LinkedIn OAuth** - Sign in with LinkedIn
- **Secure Sessions** - Supabase Auth integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Google AI API key
- LinkedIn Developer account (optional)
- Resend account (optional, for emails)

### 1. Clone & Install
```bash
git clone https://github.com/piyush06singhal/linkedin-auto.git
cd linkedin-auto
npm install
```

### 2. Environment Setup
Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# LinkedIn (Optional)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/linkedin/callback

# Email Service (Optional)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=LinkedAI <noreply@yourdomain.com>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
1. Go to your Supabase project SQL editor
2. Run the schemas in order:
   ```bash
   supabase/schema.sql
   supabase/notifications_schema.sql
   supabase/workspaces_schema.sql
   ```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
linkedin-auto/
├── app/                      # Next.js 15 App Router
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard pages
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── DashboardLayout.tsx  # Main layout
│   ├── Sidebar.tsx          # Navigation sidebar
│   └── NotificationDropdown.tsx
├── lib/                     # Utilities & services
│   ├── ai/                  # AI services
│   ├── email/               # Email services
│   ├── linkedin/            # LinkedIn API
│   ├── notifications/       # Notification system
│   └── supabase/            # Supabase client
├── supabase/                # Database schemas
├── types/                   # TypeScript types
└── docs/                    # Documentation
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** Google Gemini AI
- **Email:** Resend
- **Deployment:** Vercel
- **LinkedIn API:** OAuth 2.0

## 📚 Documentation

- **[Email Troubleshooting](docs/EMAIL_TROUBLESHOOTING.md)** - Fix email delivery issues
- **[API Documentation](docs/API.md)** - API endpoints reference (coming soon)
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment (coming soon)

## 🔧 Configuration

### LinkedIn Integration
1. Create app at [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Add redirect URI: `http://localhost:3000/api/auth/linkedin/callback`
3. Request permissions: `openid`, `profile`, `email`, `w_member_social`
4. Add credentials to `.env.local`

### Email Service (Resend)
1. Sign up at [Resend](https://resend.com)
2. Get API key from dashboard
3. For production: Verify your domain
4. For testing: Use `delivered@resend.dev`

See [Email Troubleshooting Guide](docs/EMAIL_TROUBLESHOOTING.md) for detailed setup.

### Google AI (Gemini)
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local` as `GOOGLE_AI_API_KEY`

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/piyush06singhal/linkedin-auto)

**Manual Deployment:**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Environment Variables for Production:**
- Update `NEXT_PUBLIC_APP_URL` to your domain
- Update `LINKEDIN_REDIRECT_URI` to production URL
- Verify domain in Resend for email delivery

## 📊 Database Schema

### Main Tables
- `users` - User accounts and profiles
- `posts` - LinkedIn posts and drafts
- `scheduled_posts` - Scheduled content
- `templates` - Content templates
- `workspaces` - Team workspaces
- `workspace_members` - Workspace membership
- `workspace_invitations` - Pending invitations
- `notifications` - User notifications
- `notification_preferences` - Notification settings

## 🔐 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Secure authentication with Supabase
- ✅ API route protection
- ✅ Environment variable validation
- ✅ CORS configuration
- ✅ Rate limiting on API routes

## 🐛 Troubleshooting

### Email Not Sending
See [Email Troubleshooting Guide](docs/EMAIL_TROUBLESHOOTING.md)

### LinkedIn Connection Issues
1. Check redirect URI matches exactly
2. Verify app permissions in LinkedIn Developer Portal
3. Check API credentials in `.env.local`

### Database Errors
1. Verify all schemas are applied
2. Check RLS policies are enabled
3. Confirm service role key is correct

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Piyush Singhal**
- GitHub: [@piyush06singhal](https://github.com/piyush06singhal)
- Repository: [linkedin-auto](https://github.com/piyush06singhal/linkedin-auto)

## 🙏 Acknowledgments

- Google Gemini AI for content generation
- Supabase for backend infrastructure
- Resend for email delivery
- LinkedIn API for social integration
- Vercel for hosting

---

**Status:** ✅ Production Ready | **Version:** 1.0.0 | **Last Updated:** December 2024
