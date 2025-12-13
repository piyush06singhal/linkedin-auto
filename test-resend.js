#!/usr/bin/env node

/**
 * Direct Resend API Test
 * Tests if the Resend API key works by making a direct API call
 */

require('dotenv').config({ path: '.env.local' })

const RESEND_API_KEY = process.env.RESEND_API_KEY

console.log('🧪 Testing Resend API Key\n')
console.log('=' .repeat(50))

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found in .env.local')
  process.exit(1)
}

console.log('✅ API Key found:', RESEND_API_KEY.substring(0, 10) + '...')
console.log('✅ API Key length:', RESEND_API_KEY.length)
console.log('✅ API Key starts with "re_":', RESEND_API_KEY.startsWith('re_'))

console.log('\n📧 Attempting to send test email...\n')

// Use fetch to test the API directly
fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'LinkedAI <onboarding@resend.dev>',
    to: 'delivered@resend.dev',
    subject: 'Test Email from LinkedAI',
    html: '<h1>Test Email</h1><p>If you see this, your Resend API is working!</p>'
  })
})
.then(async response => {
  const data = await response.json()
  
  console.log('Response Status:', response.status)
  console.log('Response Data:', JSON.stringify(data, null, 2))
  
  if (response.ok) {
    console.log('\n✅ SUCCESS! Email sent successfully!')
    console.log('📧 Email ID:', data.id)
    console.log('\n💡 Your Resend API is working correctly!')
    console.log('📝 Check https://resend.com/emails to see the email')
  } else {
    console.log('\n❌ FAILED! Email not sent')
    console.log('Error:', data.message || data.error)
    
    if (response.status === 401) {
      console.log('\n🔑 API Key Issue:')
      console.log('- Your API key might be invalid or expired')
      console.log('- Get a new key from: https://resend.com/api-keys')
    } else if (response.status === 422) {
      console.log('\n📧 Email Format Issue:')
      console.log('- Check the from/to email addresses')
      console.log('- Make sure domain is verified (or use onboarding@resend.dev)')
    }
  }
})
.catch(error => {
  console.error('\n❌ Network Error:', error.message)
  console.log('\n💡 Troubleshooting:')
  console.log('- Check your internet connection')
  console.log('- Verify the API key is correct')
  console.log('- Try again in a few moments')
})
