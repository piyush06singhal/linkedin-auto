import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      // Redirect to login with error
      return NextResponse.redirect(new URL('/login?error=confirmation_failed', request.url))
    }

    // If this is an email confirmation (signup), redirect to login with success message
    if (type === 'signup') {
      return NextResponse.redirect(new URL('/login?confirmed=true', request.url))
    }
  }

  // For OAuth or other auth types, redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
