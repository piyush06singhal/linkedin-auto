import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createImageGenerator } from '@/lib/ai/image-generator'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, style, aspectRatio, action } = body

    const imageGen = createImageGenerator()

    let result

    switch (action) {
      case 'generate':
        result = await imageGen.generateImage({ prompt, style, aspectRatio })
        break

      case 'variations':
        result = await imageGen.generateVariations(prompt, 3)
        break

      case 'from-post':
        const { postContent } = body
        result = await imageGen.generateFromPost(postContent)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    )
  }
}
