import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createGeminiClient } from '@/lib/ai/gemini-client'

// Rate limiting: Track last request time per user
const lastRequestTime = new Map<string, number>()
const MIN_REQUEST_INTERVAL = 5000 // 5 seconds between requests to avoid quota issues

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting check
    const now = Date.now()
    const lastRequest = lastRequestTime.get(user.id) || 0
    const timeSinceLastRequest = now - lastRequest
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000)
      return NextResponse.json(
        { error: `Please wait ${waitTime} seconds before generating more ideas to avoid rate limits.` },
        { status: 429 }
      )
    }
    
    lastRequestTime.set(user.id, now)

    const body = await request.json()
    const { category, count = 6 } = body

    console.log('🎯 Generating content ideas...')
    console.log('Category:', category || 'All')
    console.log('Count:', count)

    const gemini = createGeminiClient()

    const categoryFilter = category && category !== 'All' ? ` in the "${category}" category` : ''
    
    const prompt = `You are a LinkedIn content strategist. Generate ${count} unique and engaging LinkedIn post ideas${categoryFilter}.

For each idea, provide:
1. A catchy title (10-15 words)
2. A brief description explaining the idea (20-30 words)
3. Category (one of: Thought Leadership, Personal Story, Industry News, Tips & Tricks, Career Advice, Trending Topics)
4. Difficulty (Easy, Medium, or Hard)
5. Expected Engagement (Medium, High, or Very High)
6. Whether it's trending (true/false)

Return ONLY a valid JSON array with this exact structure (no additional text):
[
  {
    "title": "string",
    "description": "string",
    "category": "string",
    "difficulty": "string",
    "engagement": "string",
    "trending": boolean
  }
]

Make the ideas:
- Specific and actionable
- Relevant to current LinkedIn trends
- Diverse in topics and approaches
- Authentic and relatable
- Designed to drive engagement

Generate the JSON array now:`

    const response = await gemini.generatePost({
      topic: prompt,
      tone: 'professional',
      length: 'long',
      includeHashtags: false,
      includeEmojis: false,
    })

    console.log('📥 AI Response received')

    // Parse the JSON response
    let ideas
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = response.trim()
      
      // Remove ```json and ``` markers
      cleanedResponse = cleanedResponse.replace(/```json\s*/g, '')
      cleanedResponse = cleanedResponse.replace(/```\s*/g, '')
      
      // Extract JSON array from response
      const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0])
      } else {
        console.error('❌ No JSON array found in response')
        console.error('Raw response:', response)
        throw new Error('No JSON array found in response')
      }
      
      // Validate the structure
      if (!Array.isArray(ideas) || ideas.length === 0) {
        throw new Error('Invalid response structure: expected non-empty array')
      }
      
      // Validate each idea has required fields
      ideas.forEach((idea: any, index: number) => {
        if (!idea.title || !idea.description || !idea.category) {
          console.error(`❌ Invalid idea at index ${index}:`, idea)
          throw new Error(`Invalid idea structure at index ${index}`)
        }
      })
      
    } catch (parseError: any) {
      console.error('❌ Failed to parse AI response:', parseError)
      console.error('Raw response:', response)
      
      throw new Error(`Failed to parse AI response: ${parseError.message}. Please try again.`)
    }

    // Add unique IDs to each idea
    const ideasWithIds = ideas.map((idea: any, index: number) => ({
      ...idea,
      id: `${Date.now()}-${index}`
    }))

    console.log('✅ Generated', ideasWithIds.length, 'content ideas')

    return NextResponse.json({ success: true, ideas: ideasWithIds })
  } catch (error: any) {
    console.error('Generate ideas error:', error)
    
    // Handle quota exceeded errors specifically
    if (error.message.includes('Quota exceeded') || error.message.includes('quota')) {
      return NextResponse.json(
        { 
          error: 'API quota limit reached. Please wait a minute and try again. The free tier has a limit of 20 requests per minute.' 
        },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}
