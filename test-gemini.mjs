// Simple test for Gemini models - Replace YOUR_API_KEY with actual key
const API_KEY = process.env.GOOGLE_AI_API_KEY || 'YOUR_API_KEY_HERE'

const modelsToTest = [
  { name: 'gemini-1.5-flash', version: 'v1' },
  { name: 'gemini-1.5-pro', version: 'v1' },
  { name: 'gemini-pro', version: 'v1' },
]

async function testModel(modelName, apiVersion) {
  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${API_KEY}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hello in 5 words' }] }]
      })
    })

    const data = await response.json()
    
    if (response.ok && data.candidates) {
      console.log(`✅ SUCCESS: ${modelName} (${apiVersion})`)
      console.log(`   Response: ${data.candidates[0]?.content?.parts[0]?.text}`)
      return { success: true, model: modelName, version: apiVersion }
    } else {
      console.log(`❌ FAILED: ${modelName} (${apiVersion})`)
      console.log(`   Error: ${data.error?.message || 'Unknown'}`)
      return { success: false }
    }
  } catch (error) {
    console.log(`❌ ERROR: ${modelName} (${apiVersion}) - ${error.message}`)
    return { success: false }
  }
}

async function runTests() {
  console.log('Testing Gemini Models...\n')
  
  for (const model of modelsToTest) {
    const result = await testModel(model.name, model.version)
    if (result.success) {
      console.log(`\n🎉 WORKING MODEL FOUND: ${result.model} with API version ${result.version}\n`)
      break
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

runTests()
