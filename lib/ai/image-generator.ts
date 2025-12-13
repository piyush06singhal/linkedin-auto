// Image generation for LinkedIn posts using AI
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface ImageGenerationOptions {
  prompt: string
  style?: 'professional' | 'creative' | 'minimal' | 'vibrant'
  aspectRatio?: '1:1' | '16:9' | '4:5'
}

export class ImageGenerator {
  private geminiApiKey: string

  constructor(geminiApiKey: string = '') {
    this.geminiApiKey = geminiApiKey
  }

  // Generate image using AI with Gemini-enhanced prompts
  async generateImage(options: ImageGenerationOptions): Promise<string> {
    const { prompt, style = 'professional', aspectRatio = '1:1' } = options
    
    console.log('🎨 Generating AI image with prompt:', prompt)

    // Determine image dimensions based on aspect ratio
    const dimensions = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1920, height: 1080 },
      '4:5': { width: 1024, height: 1280 },
    }
    
    const { width, height } = dimensions[aspectRatio]

    try {
      // Step 1: Use Gemini to enhance the prompt for better image generation
      let enhancedPrompt = prompt
      
      if (this.geminiApiKey) {
        try {
          console.log('🤖 Using Gemini to enhance image prompt...')
          const genAI = new GoogleGenerativeAI(this.geminiApiKey)
          const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
          
          const styleDescriptions = {
            professional: 'professional, corporate, business-like, clean, modern, high-quality',
            creative: 'creative, artistic, colorful, innovative, unique, eye-catching',
            minimal: 'minimal, clean, simple, elegant, modern, uncluttered',
            vibrant: 'vibrant, colorful, energetic, dynamic, bold, striking',
          }
          
          const promptEnhancementRequest = `Create a detailed image generation prompt for: "${prompt}"

Style: ${style} (${styleDescriptions[style]})
Context: This is for a LinkedIn post image

Requirements:
- Make it specific and detailed
- Include visual elements, colors, composition
- Keep it under 100 words
- Focus on ${style} aesthetic
- Make it suitable for professional social media

Return ONLY the enhanced prompt, nothing else.`

          const result = await model.generateContent(promptEnhancementRequest)
          enhancedPrompt = result.response.text().trim()
          console.log('✅ Enhanced prompt:', enhancedPrompt)
        } catch (geminiError) {
          console.error('⚠️ Gemini enhancement failed, using original prompt:', geminiError)
        }
      }

      // Step 2: Generate image using Pollinations.ai (free AI image generation)
      // Pollinations.ai is a free service that generates images using Stable Diffusion
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&nologo=true&enhance=true`
      
      console.log('🎨 Generating image with Pollinations.ai')
      console.log('📐 Dimensions:', `${width}x${height}`)
      
      // Test if the URL is accessible
      const testResponse = await fetch(pollinationsUrl, { method: 'HEAD' })
      
      if (testResponse.ok) {
        console.log('✅ AI image generated successfully')
        return pollinationsUrl
      } else {
        throw new Error('Pollinations.ai service unavailable')
      }
      
    } catch (error) {
      console.error('❌ AI image generation error:', error)
      
      // Fallback: Use a gradient placeholder with the prompt text
      const colors = {
        professional: '0A66C2/FFFFFF',
        creative: 'FF6B6B/FFFFFF',
        minimal: '2C3E50/FFFFFF',
        vibrant: 'FF6B35/FFFFFF',
      }
      
      const colorScheme = colors[style]
      const text = prompt.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, '')
      
      console.log('⚠️ Using fallback placeholder image')
      return `https://placehold.co/${width}x${height}/${colorScheme.replace('/', '/').split('/')[0]}/${colorScheme.split('/')[1]}/png?text=${encodeURIComponent(text)}`
    }
  }

  // Generate multiple variations
  async generateVariations(prompt: string, count: number = 3): Promise<string[]> {
    const images: string[] = []
    
    for (let i = 0; i < count; i++) {
      const image = await this.generateImage({ prompt })
      images.push(image)
    }

    return images
  }

  // Generate image from post content
  async generateFromPost(postContent: string): Promise<string> {
    // Extract key themes from post
    const prompt = this.extractImagePrompt(postContent)
    return this.generateImage({ prompt })
  }

  private extractImagePrompt(content: string): string {
    // Simple extraction - take first sentence or key phrases
    const firstSentence = content.split(/[.!?]/)[0]
    return firstSentence.substring(0, 100)
  }
}

export function createImageGenerator(): ImageGenerator {
  // Use Gemini API Key for prompt enhancement
  const geminiApiKey = process.env.GEMINI_API_KEY || ''
  
  console.log('🖼️ Creating AI ImageGenerator')
  console.log('🤖 Gemini API Status:', geminiApiKey ? '✅ Configured' : '⚠️ Not configured (will use basic prompts)')
  console.log('🎨 Using Pollinations.ai for free AI image generation')
  
  return new ImageGenerator(geminiApiKey)
}
