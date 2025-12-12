import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return NextResponse.json({
    clientId: process.env.LINKEDIN_CLIENT_ID,
    redirectUri: process.env.LINKEDIN_REDIRECT_URI,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    hasClientSecret: !!process.env.LINKEDIN_CLIENT_SECRET,
  })
}
