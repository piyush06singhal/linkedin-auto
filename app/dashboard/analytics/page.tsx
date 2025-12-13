'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  content: string
  status: string
  created_at: string
  scheduled_for: string | null
  published_at: string | null
}

interface Analytics {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  scheduledPosts: number
  thisWeekPosts: number
  thisMonthPosts: number
  avgPostLength: number
  longestStreak: number
  recentPosts: Post[]
  postsByDay: { [key: string]: number }
  postsByMonth: { [key: string]: number }
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [analytics, setAnalytics] = useState<Analytics>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    scheduledPosts: 0,
    thisWeekPosts: 0,
    thisMonthPosts: 0,
    avgPostLength: 0,
    longestStreak: 0,
    recentPosts: [],
    postsByDay: {},
    postsByMonth: {}
  })

  useEffect(() => {
    checkUserAndFetchData()
  }, [])

  const checkUserAndFetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    await fetchAnalytics(user.id)
  }

  const fetchAnalytics = async (userId: string) => {
    try {
      // Fetch all posts
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (posts) {
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        // Calculate stats
        const publishedPosts = posts.filter(p => p.status === 'published')
        const draftPosts = posts.filter(p => p.status === 'draft')
        const scheduledPosts = posts.filter(p => p.status === 'scheduled')
        
        const thisWeekPosts = posts.filter(p => new Date(p.created_at) >= weekAgo)
        const thisMonthPosts = posts.filter(p => new Date(p.created_at) >= monthAgo)

        // Calculate average post length
        const totalLength = posts.reduce((sum, p) => sum + (p.content?.length || 0), 0)
        const avgPostLength = posts.length > 0 ? Math.round(totalLength / posts.length) : 0

        // Calculate posts by day of week (Monday to Sunday)
        const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const postsByDay: { [key: string]: number} = {}
        dayOrder.forEach(day => {
          postsByDay[day] = 0
        })
        
        posts.forEach(post => {
          const date = new Date(post.created_at)
          const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
          postsByDay[dayName]++
        })

        // Calculate posts by month (last 6 months)
        const postsByMonth: { [key: string]: number } = {}
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
          postsByMonth[monthKey] = 0
        }
        posts.forEach(post => {
          const date = new Date(post.created_at)
          const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
          if (monthKey in postsByMonth) {
            postsByMonth[monthKey]++
          }
        })

        setAnalytics({
          totalPosts: posts.length,
          publishedPosts: publishedPosts.length,
          draftPosts: draftPosts.length,
          scheduledPosts: scheduledPosts.length,
          thisWeekPosts: thisWeekPosts.length,
          thisMonthPosts: thisMonthPosts.length,
          avgPostLength,
          longestStreak: 0, // Can be calculated based on consecutive days
          recentPosts: posts.slice(0, 5),
          postsByDay,
          postsByMonth
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const maxPostsByDay = Math.max(...Object.values(analytics.postsByDay), 1)
  const maxPostsByMonth = Math.max(...Object.values(analytics.postsByMonth), 1)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold">LinkedAI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link href="/dashboard/generate" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Generate</span>
          </Link>

          <Link href="/dashboard/templates" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Templates</span>
          </Link>

          <Link href="/dashboard/drafts" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Drafts</span>
          </Link>

          <Link href="/dashboard/calendar" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Calendar</span>
          </Link>

          <Link href="/dashboard/scheduled" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Scheduled</span>
          </Link>

          <Link href="/dashboard/content-ideas" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Content Ideas</span>
          </Link>

          <Link href="/dashboard/analytics" className="flex items-center space-x-3 px-4 py-3 text-primary bg-blue-50 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
          </Link>

          <div className="pt-4 border-t border-gray-200 mt-4">
            <Link href="/dashboard/workspace" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Workspaces</span>
            </Link>

            <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Analytics & Insights</h1>
                <p className="text-gray-500 mt-1">Track your LinkedIn content performance</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{analytics.totalPosts}</div>
              <p className="text-blue-100 text-sm">Total Posts</p>
              <div className="mt-3 text-sm text-blue-100">All time</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{analytics.publishedPosts}</div>
              <p className="text-green-100 text-sm">Published</p>
              <div className="mt-3 text-sm text-green-100">Live on LinkedIn</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{analytics.draftPosts}</div>
              <p className="text-purple-100 text-sm">Drafts</p>
              <div className="mt-3 text-sm text-purple-100">In progress</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{analytics.scheduledPosts}</div>
              <p className="text-orange-100 text-sm">Scheduled</p>
              <div className="mt-3 text-sm text-orange-100">Queued</div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">This Week</span>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{analytics.thisWeekPosts}</p>
              <p className="text-xs text-gray-500 mt-1">Posts created</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">This Month</span>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{analytics.thisMonthPosts}</p>
              <p className="text-xs text-gray-500 mt-1">Posts created</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Avg Length</span>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{analytics.avgPostLength}</p>
              <p className="text-xs text-gray-500 mt-1">Characters per post</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Posts by Day of Week */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Posts by Day of Week</h3>
              <div className="h-64 flex items-end justify-between space-x-2 relative">
                {/* Y-axis guide lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-200"></div>
                </div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const count = analytics.postsByDay[day] || 0
                  // Calculate height: minimum 10% for any post, scale up to 100% for max
                  const heightPercent = count === 0 ? 0 : Math.max(10, (count / maxPostsByDay) * 100)
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-xl transition-all hover:opacity-80 cursor-pointer relative group"
                        style={{ height: `${heightPercent}%` }}
                        title={`${count} posts`}
                      >
                        {count > 0 && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            {count} {count === 1 ? 'post' : 'posts'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 mt-3 font-medium">{day}</span>
                      <span className="text-xs text-gray-400">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Posts by Month */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Posts Over Time (Last 6 Months)</h3>
              <div className="h-64 flex items-end justify-between space-x-2 relative">
                {/* Y-axis guide lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-100"></div>
                  <div className="border-t border-gray-200"></div>
                </div>
                {Object.entries(analytics.postsByMonth).map(([month, count]) => {
                  const monthLabel = month.split(' ')[0] // Just show month name
                  // Calculate height: minimum 10% for any post, scale up to 100% for max
                  const heightPercent = count === 0 ? 0 : Math.max(10, (count / maxPostsByMonth) * 100)
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-xl transition-all hover:opacity-80 cursor-pointer relative group"
                        style={{ height: `${heightPercent}%` }}
                        title={`${month}: ${count} posts`}
                      >
                        {count > 0 && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            {count} {count === 1 ? 'post' : 'posts'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 mt-3 font-medium text-center">{monthLabel}</span>
                      <span className="text-xs text-gray-400">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
              <p className="text-sm text-gray-500 mt-1">Your latest content activity</p>
            </div>
            <div className="divide-y divide-gray-200">
              {analytics.recentPosts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h4>
                  <p className="text-gray-600 mb-6">Start creating content to see your analytics</p>
                  <Link
                    href="/dashboard/generate"
                    className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary transition shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Your First Post</span>
                  </Link>
                </div>
              ) : (
                analytics.recentPosts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-800 line-clamp-2 mb-2">{post.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' ? 'bg-green-100 text-green-700' :
                            post.status === 'scheduled' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {post.status}
                          </span>
                          <span>{post.content.length} chars</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">💡 AI Insights</h3>
                <p className="text-indigo-100 mb-4">
                  {analytics.totalPosts === 0 
                    ? "Start creating content to get personalized insights about your posting patterns and engagement."
                    : `You've created ${analytics.totalPosts} posts so far! ${analytics.thisWeekPosts > 0 ? `Great job staying active this week with ${analytics.thisWeekPosts} new posts.` : 'Try to post more consistently for better engagement.'}`
                  }
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Avg: {analytics.avgPostLength} chars</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{analytics.draftPosts} drafts ready</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{analytics.scheduledPosts} scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLogoutModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Logout</h2>
              <p className="text-gray-600 text-center mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
