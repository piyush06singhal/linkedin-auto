'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    postsGenerated: 0,
    drafts: 0,
    scheduled: 0,
    published: 0,
    weeklyGoal: 7,
    currentWeekPosts: 0,
    engagementRate: 0,
    totalReach: 0,
  })
  const [syncingAnalytics, setSyncingAnalytics] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  useEffect(() => {
    checkUser()
    fetchStats()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
  }

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch ALL posts for accurate stats
    const { data: allPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)

    // Fetch recent posts for display
    const { data: recentPostsData } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3)

    if (recentPostsData) {
      setRecentPosts(recentPostsData)
    }

    if (allPosts) {
      const drafts = allPosts.filter(p => p.status === 'draft').length
      const scheduled = allPosts.filter(p => p.status === 'scheduled').length
      const published = allPosts.filter(p => p.status === 'published').length

      // Calculate real engagement rate and reach from published posts with LinkedIn data
      const publishedPosts = allPosts.filter(p => p.status === 'published')
      let avgEngagementRate = 0
      let totalReach = 0
      
      if (publishedPosts.length > 0) {
        // Only calculate from posts that have LinkedIn analytics data
        const postsWithAnalytics = publishedPosts.filter(p => p.reach && p.reach > 0)
        
        if (postsWithAnalytics.length > 0) {
          const totalEngagement = postsWithAnalytics.reduce((sum, post) => {
            return sum + (post.engagement_rate || 0)
          }, 0)
          avgEngagementRate = Math.round(totalEngagement / postsWithAnalytics.length)
          
          totalReach = postsWithAnalytics.reduce((sum, post) => {
            return sum + (post.reach || 0)
          }, 0)
        }
      }

      // Calculate weekly posts (last 7 days)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const weeklyPosts = allPosts.filter(p => {
        const postDate = new Date(p.created_at)
        return postDate >= oneWeekAgo && p.status === 'published'
      }).length

      setStats({
        postsGenerated: allPosts.length,
        drafts,
        scheduled,
        published,
        weeklyGoal: 7,
        currentWeekPosts: weeklyPosts,
        engagementRate: avgEngagementRate,
        totalReach: totalReach,
      })
    } else {
      // No posts yet - show zeros
      setStats({
        postsGenerated: 0,
        drafts: 0,
        scheduled: 0,
        published: 0,
        weeklyGoal: 7,
        currentWeekPosts: 0,
        engagementRate: 0,
        totalReach: 0,
      })
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSyncAnalytics = async () => {
    setSyncingAnalytics(true)
    try {
      const response = await fetch('/api/sync-linkedin-analytics', {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        alert(`✅ Synced ${data.synced} posts with LinkedIn analytics!`)
        // Refresh stats
        fetchStats()
      } else {
        alert(data.message || data.error || 'Failed to sync analytics')
      }
    } catch (error) {
      console.error('Sync error:', error)
      alert('Failed to sync analytics. Please try again.')
    } finally {
      setSyncingAnalytics(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Good afternoon, {user?.user_metadata?.full_name || 'there'}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your LinkedIn content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Posts Generated</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.postsGenerated}</div>
            <p className="text-xs text-gray-500 mt-1">+{stats.postsGenerated} this week</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Drafts</span>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.drafts} pending</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Scheduled</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Published</span>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.published}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.published} total</p>
          </div>
        </div>



        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <button
                onClick={handleSyncAnalytics}
                disabled={syncingAnalytics}
                className="text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition disabled:opacity-50 flex items-center space-x-1"
                title="Sync with LinkedIn"
              >
                {syncingAnalytics ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Sync</span>
                  </>
                )}
              </button>
            </div>
            {stats.totalReach > 0 ? (
              <>
                <div className="text-3xl font-bold mb-1">{stats.totalReach.toLocaleString()}</div>
                <p className="text-green-100 text-sm">Total Reach (Real Data)</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold mb-1">No data yet</div>
                <p className="text-green-100 text-sm">Click Sync to fetch LinkedIn data</p>
              </>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">N/A</span>
            </div>
            {stats.engagementRate > 0 ? (
              <>
                <div className="text-3xl font-bold mb-1">{stats.engagementRate}%</div>
                <p className="text-purple-100 text-sm">Engagement Rate (Real Data)</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold mb-1">No data yet</div>
                <p className="text-purple-100 text-sm">Click Sync to fetch LinkedIn data</p>
              </>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">This week</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.scheduled}</div>
            <p className="text-orange-100 text-sm">Posts Scheduled</p>
          </div>
        </div>

        {/* Quick Actions & Weekly Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Quick Actions</h2>
              <Link href="/dashboard/generate" className="text-primary text-sm hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/generate"
                className="flex flex-col items-center justify-center p-6 border-2 border-primary border-dashed rounded-xl hover:bg-blue-50 transition"
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-medium">Generate Posts</span>
                <span className="text-xs text-gray-500 mt-1">Create AI content</span>
              </Link>

              <Link
                href="/dashboard/drafts"
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="font-medium">View Drafts</span>
                <span className="text-xs text-gray-500 mt-1">Edit saved posts</span>
              </Link>

              <Link
                href="/dashboard/calendar"
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium">Schedule</span>
                <span className="text-xs text-gray-500 mt-1">Plan your week</span>
              </Link>

              <Link
                href="/dashboard/scheduled"
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium">Queue</span>
                <span className="text-xs text-gray-500 mt-1">Upcoming posts</span>
              </Link>
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Weekly Goal</h3>
                <p className="text-sm text-white/80">Stay consistent!</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{stats.currentWeekPosts}</span>
                <span className="text-xl ml-2">/ {stats.weeklyGoal} posts</span>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${(stats.currentWeekPosts / stats.weeklyGoal) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-white/90">
              Post regularly to grow your audience.
            </p>
            <Link
              href="/dashboard/generate"
              className="mt-4 block w-full bg-white text-primary text-center py-2 rounded-lg font-medium hover:bg-white/90 transition"
            >
              Start Creating
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <Link href="/dashboard/drafts" className="text-primary text-sm hover:underline">
                View all →
              </Link>
            </div>
          </div>
          {recentPosts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 line-clamp-2">{post.content}</p>
                    </div>
                    <Link
                      href={`/dashboard/drafts`}
                      className="ml-4 text-primary hover:underline text-sm font-medium whitespace-nowrap"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
