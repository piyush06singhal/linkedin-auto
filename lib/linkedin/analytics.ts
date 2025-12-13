// LinkedIn Analytics API Client
// Fetches real post statistics from LinkedIn

export interface LinkedInPostStats {
  postId: string
  impressions: number
  likes: number
  comments: number
  shares: number
  clicks: number
  engagementRate: number
}

export class LinkedInAnalytics {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  /**
   * Fetch statistics for a specific post
   * Uses LinkedIn's Share Statistics API
   */
  async getPostStats(shareUrn: string): Promise<LinkedInPostStats> {
    try {
      // LinkedIn Share Statistics API
      const response = await fetch(
        `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodeURIComponent(shareUrn)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          }
        }
      )

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Extract statistics
      const stats = data.elements?.[0]?.totalShareStatistics || {}
      
      const impressions = stats.impressionCount || 0
      const likes = stats.likeCount || 0
      const comments = stats.commentCount || 0
      const shares = stats.shareCount || 0
      const clicks = stats.clickCount || 0
      
      // Calculate engagement rate
      const totalEngagements = likes + comments + shares + clicks
      const engagementRate = impressions > 0 
        ? Math.round((totalEngagements / impressions) * 100 * 10) / 10 
        : 0

      return {
        postId: shareUrn,
        impressions,
        likes,
        comments,
        shares,
        clicks,
        engagementRate
      }
    } catch (error) {
      console.error('Error fetching LinkedIn post stats:', error)
      // Return zeros if API fails
      return {
        postId: shareUrn,
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        engagementRate: 0
      }
    }
  }

  /**
   * Fetch statistics for multiple posts
   */
  async getBulkPostStats(shareUrns: string[]): Promise<LinkedInPostStats[]> {
    const results = await Promise.all(
      shareUrns.map(urn => this.getPostStats(urn))
    )
    return results
  }

  /**
   * Calculate aggregate statistics
   */
  calculateAggregateStats(stats: LinkedInPostStats[]) {
    const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0)
    const totalLikes = stats.reduce((sum, s) => sum + s.likes, 0)
    const totalComments = stats.reduce((sum, s) => sum + s.comments, 0)
    const totalShares = stats.reduce((sum, s) => sum + s.shares, 0)
    const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0)
    
    const totalEngagements = totalLikes + totalComments + totalShares + totalClicks
    const avgEngagementRate = totalImpressions > 0
      ? Math.round((totalEngagements / totalImpressions) * 100 * 10) / 10
      : 0

    return {
      totalImpressions,
      totalLikes,
      totalComments,
      totalShares,
      totalClicks,
      totalEngagements,
      avgEngagementRate,
      postsAnalyzed: stats.length
    }
  }
}

export function createLinkedInAnalytics(accessToken: string): LinkedInAnalytics {
  return new LinkedInAnalytics(accessToken)
}
