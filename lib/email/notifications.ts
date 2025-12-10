// Email notification system

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailNotifier {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Send email using Resend, SendGrid, or similar
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Using Resend API (you can replace with SendGrid, Mailgun, etc.)
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: 'LinkedAI <notifications@linkedai.app>',
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Email send error:', error)
      return false
    }
  }

  // Post published notification
  async notifyPostPublished(userEmail: string, postContent: string, linkedInUrl?: string) {
    const subject = '✅ Your LinkedIn post has been published!'
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A66C2 0%, #378FE9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .post-preview { background: white; padding: 20px; border-left: 4px solid #0A66C2; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; background: #0A66C2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Post Published!</h1>
            </div>
            <div class="content">
              <p>Great news! Your LinkedIn post has been successfully published.</p>
              
              <div class="post-preview">
                <strong>Your Post:</strong>
                <p>${postContent.substring(0, 200)}${postContent.length > 200 ? '...' : ''}</p>
              </div>

              ${linkedInUrl ? `
                <a href="${linkedInUrl}" class="button">View on LinkedIn</a>
              ` : ''}

              <p>Keep up the great work! Your consistent posting is helping you grow your LinkedIn presence.</p>

              <div class="footer">
                <p>LinkedAI - AI-Powered LinkedIn Automation</p>
                <p>You're receiving this because you enabled post notifications in your settings.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({ to: userEmail, subject, html })
  }

  // Weekly summary
  async sendWeeklySummary(userEmail: string, stats: {
    postsPublished: number
    totalEngagement: number
    topPost: string
    reachIncrease: number
  }) {
    const subject = '📊 Your Weekly LinkedIn Summary'
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A66C2 0%, #378FE9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .stat-card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; text-align: center; }
            .stat-number { font-size: 36px; font-weight: bold; color: #0A66C2; }
            .stat-label { color: #666; font-size: 14px; }
            .button { display: inline-block; background: #0A66C2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Your Week in Review</h1>
            </div>
            <div class="content">
              <p>Here's how your LinkedIn performed this week:</p>

              <div class="stat-card">
                <div class="stat-number">${stats.postsPublished}</div>
                <div class="stat-label">Posts Published</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">${stats.totalEngagement}</div>
                <div class="stat-label">Total Engagement</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">+${stats.reachIncrease}%</div>
                <div class="stat-label">Reach Increase</div>
              </div>

              <p><strong>🏆 Top Performing Post:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 5px;">${stats.topPost}</p>

              <a href="https://yourapp.com/dashboard/analytics" class="button">View Full Analytics</a>

              <p>Keep up the momentum! 🚀</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({ to: userEmail, subject, html })
  }

  // Post scheduled notification
  async notifyPostScheduled(userEmail: string, scheduledDate: string, postContent: string) {
    const subject = '📅 Post Scheduled Successfully'
    
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0A66C2;">✅ Post Scheduled!</h2>
            <p>Your post has been scheduled for: <strong>${scheduledDate}</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0A66C2; margin: 20px 0;">
              ${postContent.substring(0, 150)}...
            </div>
            <p>We'll automatically publish it at the scheduled time.</p>
            <p style="color: #666; font-size: 12px;">LinkedAI - AI-Powered LinkedIn Automation</p>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({ to: userEmail, subject, html })
  }

  // Goal achieved notification
  async notifyGoalAchieved(userEmail: string, goalType: string, value: number) {
    const subject = '🎯 Goal Achieved!'
    
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="font-size: 48px;">🎉</h1>
            <h2 style="color: #0A66C2;">Congratulations!</h2>
            <p>You've achieved your ${goalType} goal of ${value}!</p>
            <p>Keep up the amazing work!</p>
            <a href="https://yourapp.com/dashboard" style="display: inline-block; background: #0A66C2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              View Dashboard
            </a>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({ to: userEmail, subject, html })
  }
}

export function createEmailNotifier(): EmailNotifier {
  const apiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || ''
  return new EmailNotifier(apiKey)
}
