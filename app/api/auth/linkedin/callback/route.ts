import { NextResponse } from 'next/server'
import { exchangeCodeForToken } from '@/lib/linkedin/client'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const state = requestUrl.searchParams.get('state')
  const error = requestUrl.searchParams.get('error')

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard?error=${error}`, request.url)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard?error=missing_parameters', request.url)
    )
  }

  const supabase = createRouteHandlerClient({ cookies })

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== state) {
    return NextResponse.redirect(
      new URL('/dashboard?error=invalid_state', request.url)
    )
  }

  try {
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code)

    // Calculate token expiry
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in)

    // Update user record with LinkedIn tokens
    const { error: updateError } = await supabase
      .from('users')
      .update({
        linkedin_connected: true,
        linkedin_access_token: tokenData.access_token,
        linkedin_refresh_token: tokenData.refresh_token || null,
        linkedin_token_expires_at: expiresAt.toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.redirect(
        new URL('/dashboard?error=database_error', request.url)
      )
    }

    // Success! Redirect to dashboard
    return NextResponse.redirect(
      new URL('/dashboard?linkedin=connected', request.url)
    )
  } catch (error) {
    console.error('LinkedIn OAuth error:', error)
    return NextResponse.redirect(
      new URL('/dashboard?error=oauth_failed', request.url)
    )
  }
}
