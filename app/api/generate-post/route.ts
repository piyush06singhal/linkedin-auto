import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createGeminiClient } from '@/lib/ai/gemini-client'
import { createHuggingFaceClient } from '@/lib/ai/huggingface-client'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { topic, tone, length, includeHashtags, includeEmojis, action } = body

    console.log('\n🔵 API ROUTE - Generate Post Request Received')
    console.log('👤 User ID:', user.id)
    console.log('📝 Action:', action)
    console.log('🎯 Topic Received:', topic)
    console.log('🎨 Tone:', tone)
    console.log('📏 Length:', length)
    console.log('# Include Hashtags:', includeHashtags)
    console.log('😊 Include Emojis:', includeEmojis)

    // Validate API key
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('❌ GOOGLE_AI_API_KEY not configured')
      return NextResponse.json({ error: 'AI service not configured. Please contact support.' }, { status: 500 })
    }

    console.log('✅ API Key is configured')
    console.log('🤖 Creating AI client...')

    let result
    let usedFallback = false

    switch (action) {
      case 'generate':
        // Try Gemini first, fallback to Hugging Face if it fails
        try {
          console.log('🚀 Trying Gemini API first...')
          const gemini = createGeminiClient()
          result = await gemini.generatePost({
            topic,
            tone,
            length,
            includeHashtags,
            includeEmojis,
          })
          console.log('✅ Post generated with Gemini!')
        } catch (geminiError: any) {
          console.log('⚠️ Gemini failed:', geminiError.message)
          
          // Check if it's a rate limit error
          if (geminiError.message.includes('quota') || 
              geminiError.message.includes('exceeded') ||
              geminiError.message.includes('429')) {
            console.log('🤗 Falling back to Hugging Face...')
            
            const hf = createHuggingFaceClient()
            result = await hf.generatePost({
              topic,
              tone,
              length,
              includeHashtags,
              includeEmojis,
            })
            usedFallback = true
            console.log('✅ Post generated with Hugging Face!')
          } else {
            // If it's not a rate limit error, throw it
            throw geminiError
          }
        }
        console.log('📊 Result length:', result.length, 'characters')
        break

      case 'variations':
        // Generate multiple variations (Gemini only for now)
        const geminiForVariations = createGeminiClient()
        result = await geminiForVariations.generatePostVariations(topic, 3)
        break

      case 'improve':
        // Improve existing post (Gemini only for now)
        const { originalPost } = body
        const geminiForImprove = createGeminiClient()
        result = await geminiForImprove.improvePost(originalPost)
        break

      case 'ideas':
        // Generate post ideas (Gemini only for now)
        const geminiForIdeas = createGeminiClient()
        result = await geminiForIdeas.generatePostIdeas(topic, 5)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true, 
      result,
      provider: usedFallback ? 'huggingface' : 'gemini'
    })
  } catch (error: any) {
    console.error('Generate post error:', error)
    
    // Provide user-friendly error messages
    let errorMessage = error.message || 'Failed to generate content'
    let statusCode = 500
    
    // Check for rate limit errors
    if (error.message.includes('quota') || 
        error.message.includes('exceeded') || 
        error.message.includes('Rate limit')) {
      statusCode = 429
      errorMessage = error.message // Use the enhanced error message from GeminiClient
    } else if (error.message.includes('overloaded')) {
      statusCode = 503
      errorMessage = '⚠️ AI service is temporarily overloaded. Please try again in a few seconds.'
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      statusCode = 429
      errorMessage = '⚠️ Too many requests. Please wait 60 seconds and try again.'
    } else if (error.message.includes('API key')) {
      statusCode = 500
      errorMessage = '❌ API configuration error. Please contact support.'
    } else if (error.message.includes('blocked') || error.message.includes('SAFETY')) {
      statusCode = 400
      errorMessage = '⚠️ Content was blocked by AI safety filters. Please try a different topic or tone.'
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        retryable: statusCode === 429 || statusCode === 503
      },
      { status: statusCode }
    )
  }
}
