'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

export default function ScheduledPage() {
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScheduledPosts()
  }, [])

  const fetchScheduledPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Scheduled Posts</h1>
            <p className="text-gray-600">{scheduledPosts.length} posts scheduled</p>
          </div>
          <Link
            href="/dashboard/calendar"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition"
          >
            Schedule New Post
          </Link>
        </div>

        {scheduledPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Scheduled Posts</h3>
            <p className="text-gray-600 mb-6">Schedule posts to publish automatically</p>
            <Link
              href="/dashboard/calendar"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition"
            >
              Schedule a Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                        Scheduled
                      </span>
                      <span className="text-sm text-gray-600">
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
                    <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
                    <div className="text-sm text-gray-500">
                      {post.content.length} characters • {post.content.split(/\s+/).length} words
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => handleCancel(post.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
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
