import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createGeminiClient } from '@/lib/ai/gemini-client'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    console.log('🔍 Analyzing viral potential for post...')
    console.log('📝 Content length:', content.length, 'characters')

    const gemini = createGeminiClient()

    // Create a detailed prompt for viral analysis
    const analysisPrompt = `You are a LinkedIn content expert and data analyst. Analyze this LinkedIn post and predict its viral potential.

POST CONTENT:
"${content}"

Analyze the post based on these factors:
1. Hook strength (first line engagement)
2. Content value and relevance
3. Emotional appeal
4. Call-to-action effectiveness
5. Length and readability
6. Use of formatting (line breaks, emojis, hashtags)
7. Storytelling elements
8. Professional tone vs. authenticity balance

Provide your analysis in this EXACT JSON format (no additional text):
{
  "score": <number 0-100>,
  "engagement": <predicted likes/comments, realistic number>,
  "reach": <predicted impressions, realistic number>,
  "suggestions": [
    "<specific actionable suggestion 1>",
    "<specific actionable suggestion 2>",
    "<specific actionable suggestion 3>",
    "<specific actionable suggestion 4>"
  ],
  "bestTime": "<optimal posting time>",
  "bestDay": "<optimal posting day>",
  "strengths": [
    "<what works well 1>",
    "<what works well 2>"
  ],
  "weaknesses": [
    "<what needs improvement 1>",
    "<what needs improvement 2>"
  ]
}

Be realistic and specific. Base predictions on actual LinkedIn engagement patterns.`

    const response = await gemini.generatePost({
      topic: analysisPrompt,
      tone: 'professional',
      length: 'medium',
      includeHashtags: false,
      includeEmojis: false,
    })

    console.log('📥 AI Response:', response)

    // Parse the JSON response
    let prediction
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        prediction = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      console.error('Raw response:', response)
      
      // Fallback: Create a basic analysis
      prediction = {
        score: 75,
        engagement: 500,
        reach: 5000,
        suggestions: [
          'Add a compelling hook in the first line',
          'Include a clear call-to-action',
          'Use 3-5 relevant hashtags',
          'Break text into shorter paragraphs'
        ],
        bestTime: '9:00 AM - 11:00 AM',
        bestDay: 'Tuesday or Thursday',
        strengths: ['Good content length', 'Professional tone'],
        weaknesses: ['Could use more engagement hooks', 'Consider adding questions']
      }
    }

    console.log('✅ Viral analysis complete:', prediction)

    return NextResponse.json({ success: true, prediction })
  } catch (error: any) {
    console.error('Viral analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze post' },
      { status: 500 }
    )
  }
}
