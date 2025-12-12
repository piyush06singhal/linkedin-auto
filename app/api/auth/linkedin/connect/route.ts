import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getLinkedInAuthUrl } from '@/lib/linkedin/client'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify user is authenticated
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
    }

    // Generate state parameter for CSRF protection
    const state = `${user.id}-${Date.now()}`

    // Get LinkedIn OAuth URL
    const authUrl = getLinkedInAuthUrl(state)

    console.log('Redirecting to LinkedIn OAuth:', authUrl)

    // Redirect to LinkedIn OAuth
    return NextResponse.redirect(authUrl)
  } catch (error: any) {
    console.error('LinkedIn connect error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=connection_failed`
    )
  }
}
