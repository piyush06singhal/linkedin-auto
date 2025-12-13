#!/usr/bin/env node

/**
 * Test sending to a personal email
 * Usage: node test-personal-email.js your@email.com
 */

require('dotenv').config({ path: '.env.local' })

const recipientEmail = process.argv[2]

if (!recipientEmail) {
  console.error('❌ Please provide an email address')
  console.log('Usage: node test-personal-email.js your@email.com')
  process.exit(1)
}

async function testPersonalEmail() {
  try {
    const { Resend } = require('resend')
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found')
      process.exit(1)
    }
    
    console.log('📧 Sending test email to:', recipientEmail)
    console.log('⏳ Please wait...\n')
    
    const resend = new Resend(RESEND_API_KEY)
    
    const result = await resend.emails.send({
      from: 'LinkedAI <onboarding@resend.dev>',
      to: recipientEmail,
      subject: '✅ LinkedAI Email Test - Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6;">🎉 Email Service Working!</h1>
          <p>Hi there!</p>
          <p>This is a test email from your LinkedAI application.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>✅ Your email service is configured correctly!</strong></p>
            <p style="margin: 10px 0 0;">Workspace invitations will now work.</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            <strong>Note:</strong> This email is sent from <code>onboarding@resend.dev</code> (test domain).
            For production, verify your own domain in Resend.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #9ca3af; font-size: 12px;">
            LinkedAI - AI-Powered LinkedIn Automation
          </p>
        </div>
      `
    })
    
    console.log('✅ SUCCESS!')
    console.log('📧 Email ID:', result.data?.id)
    console.log('\n💡 Email sent to:', recipientEmail)
    console.log('📬 Check your inbox (and spam folder)')
    console.log('📝 Also check: https://resend.com/emails')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    
    if (error.message.includes('Invalid email')) {
      console.log('\n📧 The email address format is invalid')
    } else if (error.message.includes('401')) {
      console.log('\n🔑 API Key issue')
    }
  }
}

testPersonalEmail()
