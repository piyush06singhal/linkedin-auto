// Hugging Face AI Client for Content Generation (Fallback)

const HF_API_BASE = 'https://api-inference.huggingface.co/models'
// Using Mistral-7B-Instruct - excellent for following instructions
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2'

export interface GeneratePostOptions {
  topic?: string
  tone?: 'professional' | 'casual' | 'inspirational' | 'educational'
  length?: 'short' | 'medium' | 'long'
  includeHashtags?: boolean
  includeEmojis?: boolean
}

export class HuggingFaceClient {
  private apiKey: string

  constructor(apiKey?: string) {
    // Hugging Face API key is optional for public models
    this.apiKey = apiKey || ''
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

    console.log('🤗 Using Hugging Face (Mistral-7B) as fallback')
    console.log('📝 Prompt length:', prompt.length)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add API key if available (for better rate limits)
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(`${HF_API_BASE}/${HF_MODEL}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Hugging Face API Error:', errorText)
      
      // Check if model is loading
      if (response.status === 503) {
        throw new Error('AI model is loading. Please wait 20 seconds and try again.')
      }
      
      throw new Error(`Hugging Face API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Hugging Face response received')

    // Handle different response formats
    let generatedText = ''
    
    if (Array.isArray(data) && data.length > 0) {
      generatedText = data[0].generated_text || data[0].text || ''
    } else if (data.generated_text) {
      generatedText = data.generated_text
    } else if (typeof data === 'string') {
      generatedText = data
    }

    if (!generatedText) {
      console.error('❌ Empty response from Hugging Face')
      throw new Error('Empty response from AI. Please try again.')
    }

    // Clean up the response
    generatedText = this.cleanResponse(generatedText)

    console.log('📝 Generated content length:', generatedText.length)
    return generatedText.trim()
  }

  // Clean up the AI response
  private cleanResponse(text: string): string {
    // Remove any instruction artifacts
    text = text.replace(/^(Write a LinkedIn post|LinkedIn post|Post:)/i, '').trim()
    
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
      short: '100-150 words',
      medium: '150-250 words',
      long: '250-400 words',
    }

    const toneGuide = {
      professional: 'professional and authoritative',
      casual: 'conversational and friendly',
      inspirational: 'motivating and uplifting',
      educational: 'clear and informative',
    }

    let prompt = `[INST] You are an expert LinkedIn content creator. Write a ${toneGuide[tone as keyof typeof toneGuide]} LinkedIn post about "${topic}".

Requirements:
- Length: ${lengthGuide[length as keyof typeof lengthGuide]}
- Use short paragraphs (2-3 lines max)
- Start with a compelling hook
- Include specific insights about the topic
- End with a call-to-action or question`

    if (includeEmojis) {
      prompt += '\n- Add 3-5 relevant emojis throughout'
    }

    if (includeHashtags) {
      prompt += '\n- End with 3-5 relevant hashtags'
    }

    prompt += '\n\nWrite ONLY the post content, no explanations. [/INST]'

    return prompt
  }
}

// Helper function to create client
export function createHuggingFaceClient(): HuggingFaceClient {
  // API key is optional for Hugging Face
  const apiKey = process.env.HUGGINGFACE_API_KEY
  
  console.log('🤗 Creating Hugging Face Client')
  console.log('🔑 API Key Status:', apiKey ? 'Present (better rate limits)' : 'Not set (using public access)')
  
  return new HuggingFaceClient(apiKey)
}
