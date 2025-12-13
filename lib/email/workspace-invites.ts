// Workspace invitation email service
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface WorkspaceInviteEmailData {
  inviteeEmail: string
  inviterName: string
  workspaceName: string
  workspaceId: string
  role: string
  invitationId: string
}

export async function sendWorkspaceInviteEmail(data: WorkspaceInviteEmailData) {
  const {
    inviteeEmail,
    inviterName,
    workspaceName,
    workspaceId,
    role,
    invitationId
  } = data

  // For now, we'll use a simple text email since we don't have React Email templates set up
  // In production, you'd want to use proper HTML templates
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const acceptUrl = `${appUrl}/dashboard/workspace/${workspaceId}?invitation=${invitationId}`

  const subject = `You've been invited to join "${workspaceName}" on LinkedAI`
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Workspace Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                👥 Workspace Invitation
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi there! 👋
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                <strong>${inviterName}</strong> has invited you to join the workspace <strong>"${workspaceName}"</strong> on LinkedAI.
              </p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Your Role
                </p>
                <p style="margin: 0; font-size: 18px; color: #1f2937; font-weight: bold;">
                  ${role.charAt(0).toUpperCase() + role.slice(1)}
                </p>
              </div>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                Collaborate with your team to create, schedule, and manage LinkedIn content together!
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
                Or copy and paste this link into your browser:<br>
                <a href="${acceptUrl}" style="color: #3b82f6; word-break: break-all;">${acceptUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280; text-align: center;">
                <strong>LinkedAI</strong> - AI-Powered LinkedIn Automation
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                This invitation will expire in 7 days.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Footer Note -->
        <p style="margin: 20px 0 0; font-size: 12px; color: #6b7280; text-align: center;">
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const textContent = `
You've been invited to join "${workspaceName}" on LinkedAI!

${inviterName} has invited you to collaborate on their workspace.

Your Role: ${role.charAt(0).toUpperCase() + role.slice(1)}

Accept the invitation by clicking this link:
${acceptUrl}

This invitation will expire in 7 days.

---
LinkedAI - AI-Powered LinkedIn Automation
  `

  try {
    console.log('📧 Sending workspace invitation email to:', inviteeEmail)
    
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured. Email will not be sent.')
      console.log('📝 Email content (for testing):')
      console.log('To:', inviteeEmail)
      console.log('Subject:', subject)
      console.log('Accept URL:', acceptUrl)
      return { success: false, error: 'Email service not configured' }
    }

    const result = await resend.emails.send({
      from: 'LinkedAI <onboarding@resend.dev>', // Using Resend's test domain - works without verification
      to: inviteeEmail,
      subject: subject,
      html: htmlContent,
      text: textContent,
    })

    console.log('✅ Email sent successfully:', result)
    return { success: true, messageId: result.data?.id || 'sent' }
    
  } catch (error: any) {
    console.error('❌ Failed to send email:', error)
    return { success: false, error: error.message }
  }
}
