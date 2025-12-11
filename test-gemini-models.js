// Test script to find working Gemini model
require('dotenv').config({ path: '.env.local' })

const API_KEY = process.env.GOOGLE_AI_API_KEY

const modelsToTest = [
  { name: 'gemini-1.5-flash', version: 'v1' },
  { name: 'gemini-1.5-flash-latest', version: 'v1' },
  { name: 'gemini-1.5-pro', version: 'v1' },
  { name: 'gemini-1.5-pro-latest', version: 'v1' },
  { name: 'gemini-pro', version: 'v1' },
  { name: 'gemini-1.5-flash', version: 'v1beta' },
  { name: 'gemini-1.5-flash-latest', version: 'v1beta' },
  { name: 'gemini-1.5-pro', version: 'v1beta' },
  { name: 'gemini-pro', version: 'v1beta' },
]

async function testModel(modelName, apiVersion) {
  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${API_KEY}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hello' }] }]
      })
    })

    const data = await response.json()
    
    if (response.ok && data.candidates) {
      console.log(`✅ SUCCESS: ${modelName} (${apiVersion})`)
      console.log(`   Response: ${data.candidates[0]?.content?.parts[0]?.text?.substring(0, 50)}...`)
      return true
    } else {
      console.log(`❌ FAILED: ${modelName} (${apiVersion}) - ${data.error?.message || 'Unknown error'}`)
      return false
    }
  } catch (error) {
    console.log(`❌ ERROR: ${modelName} (${apiVersion}) - ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('Testing Gemini Models...\n')
  console.log(`API Key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT FOUND'}\n`)
  
  for (const model of modelsToTest) {
    await testModel(model.name, model.version)
    await new Promise(resolve => setTimeout(resolve, 500)) // Rate limiting
  }
  
  console.log('\nTest complete!')
}

runTests()
