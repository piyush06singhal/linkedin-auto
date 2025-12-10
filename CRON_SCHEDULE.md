# ⏰ Cron Jobs Schedule

## Current Configuration (Vercel Hobby Plan Compatible)

### Auto-Publishing
**Schedule:** `0 9,12,15,18 * * *`
**Runs:** 4 times per day at:
- 9:00 AM
- 12:00 PM (Noon)
- 3:00 PM
- 6:00 PM

**What it does:**
- Checks for scheduled posts
- Publishes posts to LinkedIn
- Sends email notifications

### Analytics Sync
**Schedule:** `0 20 * * *`
**Runs:** Once per day at 8:00 PM

**What it does:**
- Fetches engagement data from LinkedIn
- Updates post statistics
- Syncs likes, comments, shares

---

## 💡 Scheduling Tips

Since auto-publishing runs 4 times per day, schedule your posts for these times:
- **9:00 AM** - Morning engagement
- **12:00 PM** - Lunch break peak
- **3:00 PM** - Afternoon activity
- **6:00 PM** - Evening engagement

---

## 🚀 Upgrade Options

### Vercel Pro Plan ($20/month)
- Unlimited cron jobs
- Can run every minute: `* * * * *`
- Instant publishing at exact scheduled time

### Alternative: Manual Trigger
You can also trigger publishing manually:
```bash
# Call the API endpoint
curl -X POST https://your-app.vercel.app/api/cron/publish
```

---

## 📊 Current Setup Works Great For:
- ✅ Regular posting schedule
- ✅ Most use cases
- ✅ Free tier users
- ✅ 4 publishing windows per day
- ✅ Daily analytics sync

**Your posts will be published within a few hours of scheduled time!**
