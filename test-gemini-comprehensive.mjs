import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
  console.error('❌ GOOGLE_AI_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('🔑 API Key found:', API_KEY.substring(0, 10) + '...\n');

// List of models to test
const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-1.0-pro-latest',
];

const testPrompt = 'Write a short LinkedIn post about AI in one sentence.';

async function testModel(modelName) {
  try {
    console.log(`\n🧪 Testing: ${modelName}`);
    console.log('─'.repeat(50));
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS!');
    console.log('Response:', text.substring(0, 100) + '...');
    return { model: modelName, success: true, response: text };
    
  } catch (error) {
    console.log('❌ FAILED');
    console.log('Error:', error.message);
    return { model: modelName, success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Gemini API Model Tests\n');
  console.log('Testing models to find which one works with your API key...\n');
  
  const results = [];
  
  for (const modelName of modelsToTest) {
    const result = await testModel(modelName);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n\n📊 FINAL RESULTS');
  console.log('═'.repeat(50));
  
  const successfulModels = results.filter(r => r.success);
  const failedModels = results.filter(r => !r.success);
  
  if (successfulModels.length > 0) {
    console.log('\n✅ WORKING MODELS:');
    successfulModels.forEach(r => {
      console.log(`   ✓ ${r.model}`);
    });
    console.log('\n🎯 RECOMMENDED MODEL:', successfulModels[0].model);
    console.log('\nUpdate your lib/ai/gemini-client.ts to use:', successfulModels[0].model);
  } else {
    console.log('\n❌ NO WORKING MODELS FOUND');
    console.log('\nPossible issues:');
    console.log('1. API key might be invalid or expired');
    console.log('2. API key might not have access to these models');
    console.log('3. Network/firewall issues');
  }
  
  if (failedModels.length > 0) {
    console.log('\n❌ FAILED MODELS:');
    failedModels.forEach(r => {
      console.log(`   ✗ ${r.model}`);
      console.log(`     Error: ${r.error}`);
    });
  }
}

runTests().catch(console.error);
