import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createGeminiClient } from '@/lib/ai/gemini-client'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { topic, tone, length, includeHashtags, includeEmojis, action } = body

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
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}
