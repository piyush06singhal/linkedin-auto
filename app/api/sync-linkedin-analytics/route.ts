import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createLinkedInAnalytics } from '@/lib/linkedin/analytics'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Syncing LinkedIn analytics for user:', user.id)

    // Get user's LinkedIn access token
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('linkedin_access_token')
      .eq('id', user.id)
      .single()

    if (userError || !userData || !userData.linkedin_access_token) {
      return NextResponse.json({ 
        error: 'LinkedIn not connected',
        message: 'Please connect your LinkedIn account in Settings to sync analytics'
      }, { status: 400 })
    }

    // Get all published posts with LinkedIn post IDs
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, linkedin_post_id, content')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .not('linkedin_post_id', 'is', null)

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: 'No published posts to sync',
        synced: 0
      })
    }

    console.log(`📊 Found ${posts.length} published posts to sync`)

    // Create LinkedIn analytics client
    const analytics = createLinkedInAnalytics(userData.linkedin_access_token)

    // Fetch stats for all posts
    const linkedInPostIds = posts.map(p => p.linkedin_post_id!).filter(Boolean)
    const stats = await analytics.getBulkPostStats(linkedInPostIds)

    // Update posts with real analytics
    let syncedCount = 0
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const postStats = stats[i]

      if (postStats) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({
            reach: postStats.impressions,
            likes: postStats.likes,
            comments: postStats.comments,
            shares: postStats.shares,
            engagement_rate: postStats.engagementRate
          })
          .eq('id', post.id)

        if (!updateError) {
          syncedCount++
          console.log(`✅ Synced analytics for post ${post.id}`)
        } else {
          console.error(`❌ Failed to update post ${post.id}:`, updateError)
        }
      }
    }

    // Calculate aggregate stats
    const aggregateStats = analytics.calculateAggregateStats(stats)

    console.log(`✅ Sync complete: ${syncedCount}/${posts.length} posts updated`)

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      total: posts.length,
      aggregateStats
    })

  } catch (error: any) {
    console.error('Sync LinkedIn analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync analytics' },
      { status: 500 }
    )
  }
}
