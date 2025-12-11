import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
  console.error('❌ GOOGLE_AI_API_KEY not found');
  process.exit(1);
}

console.log('🔑 API Key found:', API_KEY.substring(0, 10) + '...\n');

// Test both v1 and v1beta API versions
const apiVersions = ['v1', 'v1beta'];

async function listModels(apiVersion) {
  try {
    console.log(`\n📋 Listing models for API version: ${apiVersion}`);
    console.log('─'.repeat(50));
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      console.log(`❌ Failed: ${response.status} ${response.statusText}`);
      const error = await response.json().catch(() => ({}));
      console.log('Error:', error);
      return null;
    }
    
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      console.log(`✅ Found ${data.models.length} models:\n`);
      
      data.models.forEach(model => {
        console.log(`📦 ${model.name}`);
        if (model.displayName) console.log(`   Display: ${model.displayName}`);
        if (model.supportedGenerationMethods) {
          console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
        console.log('');
      });
      
      return data.models;
    } else {
      console.log('❌ No models found');
      return null;
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

async function testModelGeneration(modelName, apiVersion) {
  try {
    console.log(`\n🧪 Testing generation with: ${modelName} (${apiVersion})`);
    console.log('─'.repeat(50));
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/${apiVersion}/${modelName}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Say hello in one sentence.' }]
          }]
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log(`❌ Failed: ${response.status}`);
      console.log('Error:', error.error?.message || 'Unknown error');
      return false;
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      console.log('✅ SUCCESS!');
      console.log('Response:', text);
      return true;
    } else {
      console.log('❌ No text in response');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function run() {
  console.log('🚀 Gemini API Model Discovery\n');
  
  const allModels = [];
  
  // List models for each API version
  for (const version of apiVersions) {
    const models = await listModels(version);
    if (models) {
      allModels.push({ version, models });
    }
  }
  
  // Test generation with found models
  if (allModels.length > 0) {
    console.log('\n\n🎯 Testing Generation with Available Models');
    console.log('═'.repeat(50));
    
    for (const { version, models } of allModels) {
      // Find models that support generateContent
      const generativeModels = models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (generativeModels.length > 0) {
        console.log(`\n📍 Testing ${version} models...`);
        
        // Test first generative model
        const testModel = generativeModels[0];
        const success = await testModelGeneration(testModel.name, version);
        
        if (success) {
          console.log(`\n\n✅ RECOMMENDED CONFIGURATION:`);
          console.log(`   API Version: ${version}`);
          console.log(`   Model: ${testModel.name}`);
          console.log(`   Display Name: ${testModel.displayName || 'N/A'}`);
          break;
        }
      }
    }
  } else {
    console.log('\n❌ No models found in any API version');
    console.log('\nPossible issues:');
    console.log('1. API key might be invalid');
    console.log('2. API key might not have proper permissions');
    console.log('3. Network/firewall blocking requests');
  }
}

run().catch(console.error);
