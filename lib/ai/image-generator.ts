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

  // Generate image using Gemini Imagen 3 (Nano Banana)
  async generateImage(options: ImageGenerationOptions): Promise<string> {
    const { prompt, style = 'professional', aspectRatio = '1:1' } = options
    
    console.log('🎨 Generating AI image with Gemini Imagen 3')
    console.log('📝 Prompt:', prompt)

    if (!this.geminiApiKey) {
      console.error('❌ GEMINI_API_KEY not configured')
      return this.getFallbackImage(prompt, style, aspectRatio)
    }

    try {
      // Build enhanced prompt with style
      const styleDescriptions = {
        professional: 'professional, corporate, business-like, clean, modern, high-quality, LinkedIn-appropriate',
        creative: 'creative, artistic, colorful, innovative, unique, eye-catching, imaginative',
        minimal: 'minimal, clean, simple, elegant, modern, uncluttered, sophisticated',
        vibrant: 'vibrant, colorful, energetic, dynamic, bold, striking, lively',
      }

      const enhancedPrompt = `${prompt}. Style: ${styleDescriptions[style]}. High quality, professional photography, 4K resolution.`
      
      console.log('🎨 Enhanced prompt:', enhancedPrompt)

      // Use Gemini Imagen 3 API
      // Note: This uses the REST API directly since the SDK doesn't support image generation yet
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${this.geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [
              {
                prompt: enhancedPrompt,
              }
            ],
            parameters: {
              sampleCount: 1,
              aspectRatio: aspectRatio,
              safetyFilterLevel: 'block_some',
              personGeneration: 'allow_adult',
            }
          })
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Gemini Imagen API error:', response.status, errorText)
        throw new Error(`Gemini Imagen API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        // Convert base64 to data URL
        const base64Image = data.predictions[0].bytesBase64Encoded
        const imageUrl = `data:image/png;base64,${base64Image}`
        
        console.log('✅ Image generated successfully with Gemini Imagen 3')
        return imageUrl
      } else {
        console.error('❌ Unexpected response format:', data)
        throw new Error('Invalid response from Gemini Imagen API')
      }
      
    } catch (error: any) {
      console.error('❌ Gemini Imagen generation error:', error)
      
      // Fallback to Pollinations.ai
      console.log('⚠️ Falling back to Pollinations.ai')
      return this.generateWithPollinations(prompt, style, aspectRatio)
    }
  }

  // Fallback: Generate with Pollinations.ai
  private async generateWithPollinations(
    prompt: string, 
    style: string, 
    aspectRatio: string
  ): Promise<string> {
    try {
      const dimensions = {
        '1:1': { width: 1024, height: 1024 },
        '16:9': { width: 1920, height: 1080 },
        '4:5': { width: 1024, height: 1280 },
      }
      
      const { width, height } = dimensions[aspectRatio as keyof typeof dimensions]
      
      const styleKeywords = {
        professional: 'professional corporate business',
        creative: 'creative artistic colorful',
        minimal: 'minimal clean simple',
        vibrant: 'vibrant colorful energetic',
      }
      
      const enhancedPrompt = `${prompt}, ${styleKeywords[style as keyof typeof styleKeywords]}`
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&nologo=true&enhance=true`
      
      console.log('🎨 Using Pollinations.ai fallback')
      return pollinationsUrl
      
    } catch (error) {
      console.error('❌ Pollinations.ai error:', error)
      return this.getFallbackImage(prompt, style, aspectRatio)
    }
  }

  // Final fallback: Placeholder image
  private getFallbackImage(prompt: string, style: string, aspectRatio: string): string {
    const dimensions = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1920, height: 1080 },
      '4:5': { width: 1024, height: 1280 },
    }
    
    const { width, height } = dimensions[aspectRatio as keyof typeof dimensions]
    
    const colors = {
      professional: '0A66C2/FFFFFF',
      creative: 'FF6B6B/FFFFFF',
      minimal: '2C3E50/FFFFFF',
      vibrant: 'FF6B35/FFFFFF',
    }
    
    const colorScheme = colors[style as keyof typeof colors]
    const text = prompt.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, '')
    
    console.log('⚠️ Using placeholder fallback')
    return `https://placehold.co/${width}x${height}/${colorScheme.split('/')[0]}/${colorScheme.split('/')[1]}/png?text=${encodeURIComponent(text)}`
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
  // Use Gemini API Key for Imagen 3 image generation
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || ''
  
  console.log('🖼️ Creating AI ImageGenerator')
  console.log('🤖 Gemini Imagen 3 Status:', geminiApiKey ? '✅ Configured' : '❌ Not configured')
  console.log('🎨 Using Gemini Imagen 3 (Nano Banana) for AI image generation')
  console.log('🔄 Fallback: Pollinations.ai if Gemini fails')
  
  return new ImageGenerator(geminiApiKey)
}
