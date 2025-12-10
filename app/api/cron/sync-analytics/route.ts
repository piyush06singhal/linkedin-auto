import { NextResponse } from 'next/server'
import { syncLinkedInAnalytics } from '@/lib/scheduler/publisher'

// This endpoint should be called by a cron job every hour
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await syncLinkedInAnalytics()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Cron sync error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const result = await syncLinkedInAnalytics()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
