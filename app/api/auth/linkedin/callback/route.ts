import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { exchangeCodeForToken } from '@/lib/linkedin/client'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('LinkedIn OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=linkedin_auth_failed`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=no_code`
      )
    }

    // Exchange code for access token
    console.log('Exchanging code for LinkedIn access token...')
    const tokenData = await exchangeCodeForToken(code)

    // Get user from Supabase
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=unauthorized`
      )
    }

    // Get LinkedIn user profile to get their ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile')
    }

    const linkedInProfile = await profileResponse.json()
    console.log('LinkedIn profile:', linkedInProfile)

    // Store LinkedIn credentials in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        linkedin_connected: true,
        linkedin_access_token: tokenData.access_token,
        linkedin_refresh_token: tokenData.refresh_token || null,
        linkedin_user_id: linkedInProfile.sub, // LinkedIn user ID
        linkedin_token_expires_at: new Date(
          Date.now() + tokenData.expires_in * 1000
        ).toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw updateError
    }

    console.log('✅ LinkedIn connected successfully')

    // Redirect back to settings with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=linkedin_connected`
    )
  } catch (error: any) {
    console.error('LinkedIn callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=connection_failed`
    )
  }
}
