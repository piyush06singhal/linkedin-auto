import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const testEmail = searchParams.get('email') || 'delivered@resend.dev'
    
    console.log('🧪 Testing Resend email service...')
    console.log('🔑 API Key present:', !!process.env.RESEND_API_KEY)
    console.log('📧 Test email address:', testEmail)
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'RESEND_API_KEY not found in environment variables',
        instructions: 'Add RESEND_API_KEY to your .env.local file'
      })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Test with Resend's test email address
    const result = await resend.emails.send({
      from: 'LinkedAI Test <onboarding@resend.dev>',
      to: testEmail,
      subject: '✅ LinkedAI Email Test - Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6;">🎉 Email Service Working!</h1>
          <p>Your Resend email service is configured correctly.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>API Key:</strong> ✅ Valid</p>
            <p style="margin: 10px 0 0;"><strong>Test Email:</strong> ${testEmail}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            <strong>Next Steps:</strong><br>
            1. To send to real email addresses, verify your domain in Resend<br>
            2. Or use delivered@resend.dev for testing<br>
            3. Update RESEND_FROM_EMAIL in your environment variables
          </p>
        </div>
      `,
    })

    console.log('✅ Resend test result:', result)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resend API is working! Email sent successfully.',
      emailId: result.data?.id,
      testEmail: testEmail,
      note: 'Check your inbox at ' + testEmail,
      instructions: {
        forRealEmails: 'Verify your domain in Resend dashboard',
        testEmail: 'Use delivered@resend.dev for testing',
        envVariable: 'Set RESEND_FROM_EMAIL=YourName <your@domain.com>'
      }
    })
    
  } catch (error: any) {
    console.error('❌ Resend test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      statusCode: error.statusCode,
      details: error.response?.data || error,
      troubleshooting: {
        invalidApiKey: 'Check if RESEND_API_KEY is correct',
        domainNotVerified: 'Verify your domain in Resend or use onboarding@resend.dev',
        rateLimited: 'Wait a few minutes and try again'
      }
    }, { status: 500 })
  }
}
