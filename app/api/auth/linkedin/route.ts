import { NextResponse } from 'next/server'
import { getLinkedInAuthUrl } from '@/lib/linkedin/client'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Generate state parameter for security (prevents CSRF)
  const state = user.id // Use user ID as state
  
  // Get LinkedIn authorization URL
  const authUrl = getLinkedInAuthUrl(state)
  
  // Redirect to LinkedIn
  return NextResponse.redirect(authUrl)
}
