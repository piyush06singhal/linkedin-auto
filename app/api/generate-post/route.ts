import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createGeminiClient } from '@/lib/ai/gemini-client'

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

    // Validate API key
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('GOOGLE_AI_API_KEY not configured')
      return NextResponse.json({ error: 'AI service not configured. Please contact support.' }, { status: 500 })
    }

    // Create Gemini client
    const gemini = createGeminiClient()

    let result

    switch (action) {
      case 'generate':
        // Generate a single post
        result = await gemini.generatePost({
          topic,
          tone,
          length,
          includeHashtags,
          includeEmojis,
        })
        break

      case 'variations':
        // Generate multiple variations
        result = await gemini.generatePostVariations(topic, 3)
        break

      case 'improve':
        // Improve existing post
        const { originalPost } = body
        result = await gemini.improvePost(originalPost)
        break

      case 'ideas':
        // Generate post ideas
        result = await gemini.generatePostIdeas(topic, 5)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('Generate post error:', error)
    
    // Provide user-friendly error messages
    let errorMessage = error.message || 'Failed to generate content'
    
    if (error.message.includes('overloaded')) {
      errorMessage = 'The AI service is currently busy. Please try again in a few seconds.'
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      errorMessage = 'Too many requests. Please wait a moment and try again.'
    } else if (error.message.includes('API key')) {
      errorMessage = 'API configuration error. Please contact support.'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
