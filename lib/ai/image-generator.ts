// Image generation for LinkedIn posts using AI

export interface ImageGenerationOptions {
  prompt: string
  style?: 'professional' | 'creative' | 'minimal' | 'vibrant'
  aspectRatio?: '1:1' | '16:9' | '4:5'
}

export class ImageGenerator {
  private apiKey: string

  constructor(apiKey: string = '') {
    this.apiKey = apiKey // Reserved for future Unsplash API key usage
  }

  // Generate image using Unsplash API with official API key
  async generateImage(options: ImageGenerationOptions): Promise<string> {
    const { prompt, style = 'professional', aspectRatio = '1:1' } = options

    // Enhanced prompt based on style
    const styleKeywords = {
      professional: 'business office corporate professional',
      creative: 'creative art colorful design',
      minimal: 'minimal simple clean modern',
      vibrant: 'vibrant colorful energetic bold',
    }

    // Extract key words from prompt for better search
    const searchQuery = `${prompt} ${styleKeywords[style]}`.trim()
    
    // Determine image dimensions based on aspect ratio
    const dimensions = {
      '1:1': { width: 1080, height: 1080 },
      '16:9': { width: 1920, height: 1080 },
      '4:5': { width: 1080, height: 1350 },
    }
    
    const { width, height } = dimensions[aspectRatio]

    try {
      // Use official Unsplash API with your access key
      if (this.apiKey) {
        console.log('Using Unsplash API with key')
        
        const orientation = aspectRatio === '16:9' ? 'landscape' : aspectRatio === '4:5' ? 'portrait' : 'squarish'
        const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=${orientation}&client_id=${this.apiKey}`
        
        const response = await fetch(apiUrl)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Unsplash API success:', data.id)
          // Return the regular size image URL (best quality for web)
          return data.urls.regular || data.urls.full
        } else {
          console.error('Unsplash API error:', response.status, await response.text())
        }
      }
      
      // Fallback: Use Picsum Photos (reliable alternative)
      console.log('Using Picsum fallback')
      const picsumUrl = `https://picsum.photos/${width}/${height}?random=${Date.now()}`
      return picsumUrl
      
    } catch (error) {
      console.error('Image generation error:', error)
      
      // Final fallback: Create a nice gradient placeholder with text
      const colors = {
        professional: '0A66C2/FFFFFF',
        creative: 'FF6B6B/FFFFFF',
        minimal: '2C3E50/FFFFFF',
        vibrant: 'FF6B35/FFFFFF',
      }
      
      const colorScheme = colors[style]
      const text = prompt.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, '')
      
      return `https://via.placeholder.com/${width}x${height}/${colorScheme}?text=${encodeURIComponent(text)}`
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
  // Use Unsplash Access Key for official API
  const apiKey = (globalThis as any).process?.env?.UNSPLASH_ACCESS_KEY || ''
  return new ImageGenerator(apiKey)
}
