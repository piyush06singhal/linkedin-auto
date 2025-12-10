import { NextResponse } from 'next/server'
import { publishScheduledPosts } from '@/lib/scheduler/publisher'

// This endpoint should be called by a cron job every minute
// Vercel Cron: https://vercel.com/docs/cron-jobs
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await publishScheduledPosts()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Cron publish error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Allow POST as well for manual triggering
export async function POST() {
  try {
    const result = await publishScheduledPosts()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
