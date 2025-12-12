import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, company, subject, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Store contact form submission in database
    try {
      const supabase = createRouteHandlerClient({ cookies })
      
      await supabase
        .from('contact_submissions')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          company: company || null,
          subject: subject,
          message: message,
        })
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      // Continue even if database insert fails
    }

    // Try to send email using Resend if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        await resend.emails.send({
          from: 'LinkedAI <onboarding@resend.dev>',
          to: ['piyush.singhal.2004@gmail.com'],
          reply_to: email,
          subject: `Contact Form: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0A66C2;">New Contact Form Submission</h2>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>From:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #0A66C2; margin: 20px 0;">
                <h3 style="margin-top: 0;">Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #666; font-size: 12px;">
                This email was sent from the LinkedAI contact form.
              </p>
            </div>
          `,
        })
        
        // Send confirmation email to user
        await resend.emails.send({
          from: 'LinkedAI <onboarding@resend.dev>',
          to: [email],
          subject: 'We received your message!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0A66C2;">Thank you for contacting LinkedAI!</h2>
              <p>Hi ${firstName},</p>
              <p>We've received your message and will get back to you within 24 hours.</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Your message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <p>Best regards,<br>The LinkedAI Team</p>
            </div>
          `,
        })
      } catch (emailError: any) {
        console.error('Email sending failed:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your message! We\'ve received your inquiry and will respond within 24 hours.' 
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
