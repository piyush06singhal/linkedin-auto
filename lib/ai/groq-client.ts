// Groq AI Client for Content Generation (Fast & Free)

const GROQ_API_BASE = 'https://api.groq.com/openai/v1'
// Using Llama 3.3 70B - latest model for content generation
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export interface GeneratePostOptions {
  topic?: string
  tone?: 'professional' | 'casual' | 'inspirational' | 'educational'
  length?: 'short' | 'medium' | 'long'
  includeHashtags?: boolean
  includeEmojis?: boolean
}

export class GroqClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Generate a LinkedIn post
  async generatePost(options: GeneratePostOptions = {}): Promise<string> {
    const {
      topic = 'professional development',
      tone = 'professional',
      length = 'medium',
      includeHashtags = true,
      includeEmojis = false,
    } = options

    const prompt = this.buildPrompt(topic, tone, length, includeHashtags, includeEmojis)

    console.log('⚡ Using Groq (Llama 3 70B) - Super Fast!')
    console.log('📝 Prompt length:', prompt.length)
    console.log('🔗 API URL:', `${GROQ_API_BASE}/chat/completions`)
    console.log('🔑 API Key (first 20 chars):', this.apiKey.substring(0, 20))

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    let response
    try {
      response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert LinkedIn content creator. Write engaging, professional LinkedIn posts that get high engagement.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          top_p: 0.9,
        }),
      })
      
      clearTimeout(timeoutId)
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        throw new Error('Groq request timed out after 30 seconds')
      }
      throw fetchError
    }

    console.log('📥 Groq response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Groq API Error:', errorText)
      
      // Check for rate limit
      if (response.status === 429) {
        throw new Error('Groq rate limit reached. Please wait a moment and try again.')
      }
      
      throw new Error(`Groq API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Groq response received')

    const generatedText = data.choices?.[0]?.message?.content

    if (!generatedText) {
      console.error('❌ Empty response from Groq')
      throw new Error('Empty response from AI. Please try again.')
    }

    // Clean up the response
    const cleanedText = this.cleanResponse(generatedText)

    console.log('📝 Generated content length:', cleanedText.length)
    return cleanedText.trim()
  }

  // Clean up the AI response
  private cleanResponse(text: string): string {
    // Remove any instruction artifacts
    text = text.replace(/^(Here's a LinkedIn post|LinkedIn post|Post:)/i, '').trim()
    
    // Remove excessive newlines
    text = text.replace(/\n{3,}/g, '\n\n')
    
    return text
  }

  // Build the prompt for post generation
  private buildPrompt(
    topic: string,
    tone: string,
    length: string,
    includeHashtags: boolean,
    includeEmojis: boolean
  ): string {
    const lengthGuide = {
      short: '100-150 words (2-3 short paragraphs)',
      medium: '150-250 words (3-4 paragraphs)',
      long: '250-400 words (5-6 paragraphs)',
    }

    const toneGuide = {
      professional: 'professional and authoritative, like a thought leader',
      casual: 'conversational and friendly, like talking to a colleague',
      inspirational: 'motivating and uplifting, sharing lessons and encouraging action',
      educational: 'clear and informative, teaching something valuable',
    }

    let prompt = `Write a LinkedIn post about "${topic}".

Requirements:
- Tone: ${toneGuide[tone as keyof typeof toneGuide]}
- Length: ${lengthGuide[length as keyof typeof lengthGuide]}
- Start with a compelling hook (question, bold statement, or surprising fact)
- Use short paragraphs (2-3 lines max) for readability
- Add line breaks between paragraphs
- Include specific insights or examples related to the topic
- End with a call-to-action or thought-provoking question`

    if (includeEmojis) {
      prompt += '\n- Add 3-5 relevant emojis throughout the post to emphasize key points'
    }

    if (includeHashtags) {
      prompt += '\n- End with 3-5 highly relevant hashtags'
    }

    prompt += '\n\nWrite ONLY the post content, no explanations or meta-commentary.'

    return prompt
  }
}

// Helper function to create client
export function createGroqClient(): GroqClient {
  const apiKey = process.env.GROQ_API_KEY
  
  console.log('⚡ Creating Groq Client')
  console.log('🔑 API Key Status:', apiKey ? `Present (${apiKey.substring(0, 15)}...)` : '❌ MISSING')
  
  if (!apiKey) {
    console.error('❌ GROQ_API_KEY is not configured in environment variables!')
    throw new Error('GROQ_API_KEY is not configured')
  }

  return new GroqClient(apiKey)
}
