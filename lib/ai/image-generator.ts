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

    // Enhanced prompt based on style - more specific keywords for better results
    const styleKeywords = {
      professional: 'business professional corporate workplace',
      creative: 'creative artistic colorful innovative design',
      minimal: 'minimal clean simple modern elegant',
      vibrant: 'vibrant colorful energetic dynamic bold',
    }

    // Build a more intelligent search query
    // Extract key nouns and concepts from the prompt
    const cleanPrompt = prompt.toLowerCase().trim()
    const searchQuery = `${cleanPrompt} ${styleKeywords[style]}`
    
    // Determine image dimensions based on aspect ratio
    const dimensions = {
      '1:1': { width: 1080, height: 1080 },
      '16:9': { width: 1920, height: 1080 },
      '4:5': { width: 1080, height: 1350 },
    }
    
    const { width, height } = dimensions[aspectRatio]

    try {
      // Use official Unsplash API with your access key
      if (this.apiKey && this.apiKey.length > 10) {
        console.log('🎨 Using Unsplash API for AI-powered image search')
        console.log('Search query:', searchQuery)
        
        const orientation = aspectRatio === '16:9' ? 'landscape' : aspectRatio === '4:5' ? 'portrait' : 'squarish'
        
        // Use Unsplash Search API for better relevance
        const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&orientation=${orientation}&per_page=10&client_id=${this.apiKey}`
        
        const searchResponse = await fetch(searchUrl)
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          
          if (searchData.results && searchData.results.length > 0) {
            // Get a random image from top 10 results for variety
            const randomIndex = Math.floor(Math.random() * Math.min(searchData.results.length, 10))
            const selectedImage = searchData.results[randomIndex]
            
            console.log('✅ Found relevant image:', selectedImage.alt_description || selectedImage.description)
            console.log('📸 Image by:', selectedImage.user.name)
            
            // Return high-quality image URL
            return selectedImage.urls.regular || selectedImage.urls.full
          } else {
            console.log('⚠️ No results found for query, trying fallback search')
            
            // Fallback: Try with just the main prompt without style keywords
            const fallbackUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(cleanPrompt)}&orientation=${orientation}&client_id=${this.apiKey}`
            const fallbackResponse = await fetch(fallbackUrl)
            
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json()
              console.log('✅ Fallback search successful')
              return fallbackData.urls.regular || fallbackData.urls.full
            }
          }
        } else {
          const errorText = await searchResponse.text()
          console.error('❌ Unsplash API error:', searchResponse.status, errorText)
        }
      } else {
        console.log('⚠️ No Unsplash API key configured')
        console.log('💡 Add UNSPLASH_ACCESS_KEY to your .env.local file for AI-powered image generation')
      }
      
      // Fallback: Use Picsum Photos with seed for consistency
      console.log('Using Picsum fallback with seed based on prompt')
      const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const picsumUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`
      return picsumUrl
      
    } catch (error) {
      console.error('Image generation error:', error)
      
      // Final fallback: Create a nice gradient placeholder
      const colors = {
        professional: '0A66C2/FFFFFF',
        creative: 'FF6B6B/FFFFFF',
        minimal: '2C3E50/FFFFFF',
        vibrant: 'FF6B35/FFFFFF',
      }
      
      const colorScheme = colors[style]
      const text = prompt.substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, '')
      
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
  // Use Unsplash Access Key for official API (server-side only)
  const apiKey = process.env.UNSPLASH_ACCESS_KEY || ''
  
  console.log('🖼️ Creating ImageGenerator')
  console.log('🔑 API Key Status:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : '❌ MISSING')
  console.log('🔑 Full Key Length:', apiKey.length)
  
  if (!apiKey) {
    console.error('❌ UNSPLASH_ACCESS_KEY is not set in environment variables!')
    console.error('💡 Make sure to add UNSPLASH_ACCESS_KEY to your .env.local file')
  }
  
  return new ImageGenerator(apiKey)
}
