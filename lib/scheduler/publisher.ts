// Auto-publisher for scheduled posts
import { supabaseAdmin } from '@/lib/supabase/server'
import { LinkedInClient } from '@/lib/linkedin/client'

export async function publishScheduledPosts() {
  try {
    // Get all posts scheduled for now or earlier
    const now = new Date().toISOString()
    
    const { data: scheduledPosts, error } = await supabaseAdmin
      .from('posts')
      .select('*, users(linkedin_access_token, email)')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .limit(10)

    if (error) {
      console.error('Error fetching scheduled posts:', error)
      return { success: false, error: error.message }
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return { success: true, published: 0, message: 'No posts to publish' }
    }

    const results = []

    for (const post of scheduledPosts) {
      try {
        // @ts-ignore - users is joined
        const accessToken = post.users?.linkedin_access_token

        if (!accessToken) {
          console.error(`No LinkedIn token for post ${post.id}`)
          continue
        }

        // Create LinkedIn client
        const linkedin = new LinkedInClient(accessToken)

        // Get user profile to get LinkedIn ID
        const profile = await linkedin.getProfile()

        // Publish to LinkedIn
        const linkedInPost = await linkedin.createPost(post.content, profile.id)

        // Update post status
        await supabaseAdmin
          .from('posts')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            linkedin_post_id: linkedInPost.id || null,
          })
          .eq('id', post.id)

        // Send email notification if enabled
        try {
          // @ts-ignore
          const userEmail = post.users?.email
          if (userEmail) {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-notification`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'post-published',
                data: {
                  postContent: post.content,
                  linkedInUrl: linkedInPost.url,
                },
              }),
            })
          }
        } catch (emailError) {
          console.error('Email notification error:', emailError)
        }

        results.push({ id: post.id, success: true })
      } catch (error: any) {
        console.error(`Error publishing post ${post.id}:`, error)
        
        // Mark as failed
        await supabaseAdmin
          .from('posts')
          .update({
            status: 'draft', // Revert to draft on failure
          })
          .eq('id', post.id)

        results.push({ id: post.id, success: false, error: error.message })
      }
    }

    return {
      success: true,
      published: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    }
  } catch (error: any) {
    console.error('Publisher error:', error)
    return { success: false, error: error.message }
  }
}

// Sync analytics from LinkedIn
export async function syncLinkedInAnalytics() {
  try {
    const { data: publishedPosts, error } = await supabaseAdmin
      .from('posts')
      .select('*, users(linkedin_access_token, email)')
      .eq('status', 'published')
      .not('linkedin_post_id', 'is', null)
      .limit(50)

    if (error || !publishedPosts) {
      return { success: false, error: error?.message }
    }

    const results = []

    for (const post of publishedPosts) {
      try {
        // @ts-ignore
        const accessToken = post.users?.linkedin_access_token

        if (!accessToken || !post.linkedin_post_id) continue

        const linkedin = new LinkedInClient(accessToken)
        const stats = await linkedin.getPostStats(post.linkedin_post_id)

        // Update post with real stats
        await supabaseAdmin
          .from('posts')
          .update({
            likes: stats.likes || 0,
            comments: stats.comments || 0,
            shares: stats.shares || 0,
            reach: stats.impressions || 0,
            engagement_rate: stats.engagementRate || 0,
          })
          .eq('id', post.id)

        results.push({ id: post.id, success: true })
      } catch (error: any) {
        console.error(`Error syncing analytics for post ${post.id}:`, error)
        results.push({ id: post.id, success: false })
      }
    }

    return {
      success: true,
      synced: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
