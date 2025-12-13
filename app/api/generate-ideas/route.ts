import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createGeminiClient } from '@/lib/ai/gemini-client'

// Rate limiting: Track last request time per user
const lastRequestTime = new Map<string, number>()
const MIN_REQUEST_INTERVAL = 5000 // 5 seconds between requests to avoid quota issues

// Fallback ideas generator
function generateFallbackIdeas(count: number, category?: string) {
  const allIdeas = [
    {
      title: "Share your biggest career mistake and the lesson you learned",
      description: "People love authentic stories. Share a mistake you made and what it taught you about growth.",
      category: "Personal Story",
      difficulty: "Easy",
      engagement: "High",
      trending: true
    },
    {
      title: "5 tools that transformed your productivity this year",
      description: "Share the software, apps, or tools that have made the biggest impact on how you work.",
      category: "Tips & Tricks",
      difficulty: "Easy",
      engagement: "High",
      trending: false
    },
    {
      title: "Your unpopular opinion about your industry",
      description: "Share a contrarian view that challenges common assumptions in your field.",
      category: "Thought Leadership",
      difficulty: "Hard",
      engagement: "Very High",
      trending: true
    },
    {
      title: "Behind the scenes: A day in your professional life",
      description: "Give people a behind-the-scenes look at what you actually do all day.",
      category: "Personal Story",
      difficulty: "Easy",
      engagement: "Medium",
      trending: false
    },
    {
      title: "Skills that will be essential in 2025",
      description: "Predict and explain the skills professionals will need to thrive in the near future.",
      category: "Career Advice",
      difficulty: "Medium",
      engagement: "High",
      trending: true
    },
    {
      title: "How AI is reshaping your industry right now",
      description: "Discuss the real impact of AI tools on your field with specific examples.",
      category: "Industry News",
      difficulty: "Medium",
      engagement: "Very High",
      trending: true
    },
    {
      title: "The best career advice you ever received",
      description: "Share wisdom that changed your professional trajectory and why it matters.",
      category: "Career Advice",
      difficulty: "Easy",
      engagement: "High",
      trending: false
    },
    {
      title: "3 myths about your profession that need to die",
      description: "Debunk common misconceptions about your field with facts and experience.",
      category: "Thought Leadership",
      difficulty: "Medium",
      engagement: "High",
      trending: false
    },
    {
      title: "From failure to success: Your comeback story",
      description: "Share a time you failed spectacularly and how you bounced back stronger.",
      category: "Personal Story",
      difficulty: "Medium",
      engagement: "Very High",
      trending: true
    }
  ]

  // Filter by category if specified
  let filteredIdeas = category && category !== 'All' 
    ? allIdeas.filter(idea => idea.category === category)
    : allIdeas

  // If not enough ideas after filtering, use all ideas
  if (filteredIdeas.length < count) {
    filteredIdeas = allIdeas
  }

  // Return requested number of ideas
  return filteredIdeas.slice(0, count)
}

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
    
    // Add timestamp to ensure unique ideas each time
    const timestamp = Date.now()
    
    const prompt = `Generate ${count} UNIQUE and CREATIVE LinkedIn post ideas${categoryFilter}. 

IMPORTANT: Make each idea completely different and original. Avoid generic or repetitive topics.

Current timestamp: ${timestamp} (use this to ensure variety)

Return ONLY valid JSON array, no other text.

Format (MUST be valid JSON):
[
  {
    "title": "Specific, unique post title",
    "description": "Detailed description of what the post would cover",
    "category": "Thought Leadership",
    "difficulty": "Easy",
    "engagement": "High",
    "trending": true
  }
]

Categories: Thought Leadership, Personal Story, Industry News, Tips & Tricks, Career Advice, Trending Topics
Difficulty: Easy, Medium, Hard
Engagement: Medium, High, Very High

Make each idea fresh, specific, and actionable. Avoid clichés.

Return ONLY the JSON array, nothing else:`

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
      
      // Use fallback ideas if parsing fails
      console.log('⚠️ Using fallback ideas due to parsing error')
      ideas = generateFallbackIdeas(count, category)
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
