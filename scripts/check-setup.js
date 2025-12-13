#!/usr/bin/env node

/**
 * Setup Checker Script
 * Verifies that all required environment variables and services are configured
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 LinkedAI Setup Checker\n')
console.log('=' .repeat(50))

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('❌ .env.local file not found!')
  console.log('   Create it by copying .env.local.example')
  process.exit(1)
}

console.log('✅ .env.local file found\n')

// Load environment variables
require('dotenv').config({ path: envPath })

// Required variables
const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'Supabase URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anon Key',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Role Key',
  'GOOGLE_AI_API_KEY': 'Google AI API Key',
  'LINKEDIN_CLIENT_ID': 'LinkedIn Client ID',
  'LINKEDIN_CLIENT_SECRET': 'LinkedIn Client Secret',
  'RESEND_API_KEY': 'Resend API Key',
  'CRON_SECRET': 'Cron Secret',
}

// Optional variables
const optionalVars = {
  'RESEND_FROM_EMAIL': 'Custom sender email (uses onboarding@resend.dev if not set)',
  'NEXT_PUBLIC_APP_URL': 'App URL (defaults to localhost:3000)',
}

console.log('📋 Required Environment Variables:\n')

let allRequired = true
for (const [key, description] of Object.entries(requiredVars)) {
  const value = process.env[key]
  if (value && value !== `your_${key.toLowerCase()}` && value !== 'your-' + key.toLowerCase().replace(/_/g, '-')) {
    console.log(`✅ ${key}`)
    console.log(`   ${description}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${key}`)
    console.log(`   ${description}: NOT SET`)
    allRequired = false
  }
  console.log()
}

console.log('📋 Optional Environment Variables:\n')

for (const [key, description] of Object.entries(optionalVars)) {
  const value = process.env[key]
  if (value && value !== `your_${key.toLowerCase()}`) {
    console.log(`✅ ${key}`)
    console.log(`   ${description}: ${value}`)
  } else {
    console.log(`⚠️  ${key}`)
    console.log(`   ${description}: Not set (using default)`)
  }
  console.log()
}

console.log('=' .repeat(50))

if (allRequired) {
  console.log('✅ All required variables are configured!')
  console.log('\n📝 Next Steps:')
  console.log('1. Run: npm run dev')
  console.log('2. Test email: http://localhost:3000/api/test-email')
  console.log('3. Check analytics: http://localhost:3000/dashboard/analytics')
} else {
  console.log('❌ Some required variables are missing!')
  console.log('\n📝 To fix:')
  console.log('1. Copy .env.local.example to .env.local')
  console.log('2. Fill in all required values')
  console.log('3. Run this script again')
  process.exit(1)
}

console.log('\n💡 Troubleshooting:')
console.log('- Email issues: See DEBUGGING_GUIDE.md')
console.log('- Analytics not showing: Create some posts first')
console.log('- Test email service: /api/test-email')
