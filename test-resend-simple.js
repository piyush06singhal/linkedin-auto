#!/usr/bin/env node

/**
 * Simple Resend Test using the Resend package
 */

require('dotenv').config({ path: '.env.local' })

async function testResend() {
  try {
    const { Resend } = require('resend')
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    
    console.log('🧪 Testing Resend API\n')
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found')
      process.exit(1)
    }
    
    console.log('✅ API Key:', RESEND_API_KEY.substring(0, 10) + '...')
    console.log('📧 Sending test email...\n')
    
    const resend = new Resend(RESEND_API_KEY)
    
    const result = await resend.emails.send({
      from: 'LinkedAI Test <onboarding@resend.dev>',
      to: 'delivered@resend.dev',
      subject: 'Test Email - LinkedAI',
      html: '<h1>✅ Success!</h1><p>Your Resend API is working correctly.</p>'
    })
    
    console.log('✅ SUCCESS!')
    console.log('📧 Email ID:', result.data?.id)
    console.log('\n💡 Email sent successfully!')
    console.log('📝 Check: https://resend.com/emails')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('\nFull error:', error)
    
    if (error.message.includes('401')) {
      console.log('\n🔑 API Key is invalid or expired')
      console.log('Get a new key: https://resend.com/api-keys')
    } else if (error.message.includes('422')) {
      console.log('\n📧 Email format issue')
      console.log('Check from/to addresses')
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
      console.log('\n🌐 Network issue')
      console.log('Check your internet connection')
    }
  }
}

testResend()
