'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default function ScheduledPage() {
  const router = useRouter()
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [linkedInConnected, setLinkedInConnected] = useState(false)
  const [publishingPostId, setPublishingPostId] = useState<string | null>(null)

  useEffect(() => {
    fetchScheduledPosts()
    checkLinkedInConnection()
  }, [])

  const checkLinkedInConnection = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: userData } = await supabase
      .from('users')
      .select('linkedin_access_token')
      .eq('id', user.id)
      .single()

    if (userData) {
      setLinkedInConnected(!!userData.linkedin_access_token)
    }
  }

  const fetchScheduledPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'scheduled')
      .order('scheduled_for', { ascending: true })

    if (data) setScheduledPosts(data)
    setLoading(false)
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this scheduled post?')) return

    await supabase
      .from('posts')
      .update({ status: 'draft', scheduled_for: null })
      .eq('id', id)

    fetchScheduledPosts()
  }

  const handlePublishNow = async (post: any) => {
    if (!linkedInConnected) {
      alert('Please connect your LinkedIn account in Settings first.')
      return
    }

    // Prevent double-click
    if (publishingPostId === post.id) {
      console.log('⚠️ Already publishing this post, ignoring duplicate request')
      return
    }

    if (!confirm('Publish this post to LinkedIn now?')) return

    try {
      setPublishingPostId(post.id)
      
      // Call API to publish to LinkedIn
      const response = await fetch('/api/publish-to-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish')
      }

      // Show appropriate message
      if (data.isDuplicate || data.alreadyPublished) {
        alert('✅ Post is already published on LinkedIn!')
      } else {
        alert('✅ Post published to LinkedIn successfully!')
      }
      
      // Wait a bit before refreshing to avoid duplicate detection
      setTimeout(() => {
        fetchScheduledPosts()
      }, 1000)
    } catch (error: any) {
      console.error('Error publishing post:', error)
      alert(`❌ Failed to publish: ${error.message}`)
    } finally {
      setPublishingPostId(null)
    }
  }

  const filteredPosts = scheduledPosts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const thisWeekPosts = scheduledPosts.filter(post => {
    const postDate = new Date(post.scheduled_for)
    const weekFromNow = new Date()
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    return postDate <= weekFromNow
  })

  const next24hPosts = scheduledPosts.filter(post => {
    const postDate = new Date(post.scheduled_for)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return postDate <= tomorrow
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scheduled posts...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Scheduled Posts</h1>
                <p className="text-gray-600">Manage your queued content</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Scheduled</p>
                  <p className="text-3xl font-bold">{scheduledPosts.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">This Week</p>
                  <p className="text-3xl font-bold">{thisWeekPosts.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Next 24h</p>
                  <p className="text-3xl font-bold text-green-600">{next24hPosts.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Publish Info */}
          {linkedInConnected && scheduledPosts.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Automatic Publishing Enabled</h3>
                  <p className="text-gray-700 text-sm">
                    Posts will be automatically published to LinkedIn at their scheduled time. 
                    The system checks every 2 minutes while you're logged in. 
                    You can also use "Publish Now" to post immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Warning */}
          {!linkedInConnected && scheduledPosts.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">LinkedIn Not Connected</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Connect your LinkedIn account in Settings to enable automatic publishing. 
                    Posts will be published automatically at their scheduled time.
                  </p>
                  <Link
                    href="/dashboard/settings"
                    className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Connect LinkedIn</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scheduled posts..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          {/* Scheduled Posts */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No scheduled posts</h3>
              <p className="text-gray-600 mb-6">Plan your content strategy by scheduling posts from your drafts or calendar</p>
              <div className="flex items-center justify-center space-x-3">
                <Link
                  href="/dashboard/calendar"
                  className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Open Calendar</span>
                </Link>
                <Link
                  href="/dashboard/drafts"
                  className="inline-flex items-center space-x-2 border-2 border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  <span>View Drafts</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Scheduled</span>
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(post.scheduled_for).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap mb-3 text-sm leading-relaxed">{post.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{post.content.length} characters</span>
                        <span>•</span>
                        <span>{post.content.split(/\s+/).length} words</span>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => handlePublishNow(post)}
                        disabled={publishingPostId === post.id}
                        className={`px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm font-medium flex items-center space-x-2 ${
                          publishingPostId === post.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Publish to LinkedIn now"
                      >
                        {publishingPostId === post.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Publishing...</span>
                          </>
                        ) : (
                          <span>Publish Now</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleCancel(post.id)}
                        disabled={publishingPostId === post.id}
                        className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </DashboardLayout>
  )
}
