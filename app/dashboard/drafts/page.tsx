'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  content: string
  created_at: string
  updated_at: string
}

export default function DraftsPage() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDraft, setSelectedDraft] = useState<Post | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })

    if (data) {
      setDrafts(data)
    }
    setLoading(false)
  }

  const handleEdit = (draft: Post) => {
    setSelectedDraft(draft)
    setEditContent(draft.content)
  }

  const handleSave = async () => {
    if (!selectedDraft) return

    const { error } = await supabase
      .from('posts')
      .update({ content: editContent, updated_at: new Date().toISOString() })
      .eq('id', selectedDraft.id)

    if (!error) {
      setSelectedDraft(null)
      fetchDrafts()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return

    await supabase.from('posts').delete().eq('id', id)
    fetchDrafts()
  }

  const handleSchedule = (draft: Post) => {
    // Navigate to calendar with draft ID
    router.push(`/dashboard/calendar?draftId=${draft.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading drafts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="text-xl font-bold">LinkedAI</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-primary">Dashboard</Link>
              <Link href="/dashboard/generate" className="text-gray-600 hover:text-primary">Generate</Link>
              <Link href="/dashboard/templates" className="text-gray-600 hover:text-primary">Templates</Link>
              <Link href="/dashboard/drafts" className="text-primary font-medium">Drafts</Link>
              <Link href="/dashboard/calendar" className="text-gray-600 hover:text-primary">Calendar</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Drafts</h1>
            <p className="text-gray-600">{drafts.length} saved drafts</p>
          </div>
          <Link
            href="/dashboard/generate"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition"
          >
            + Create New
          </Link>
        </div>

        {drafts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No drafts yet</h3>
            <p className="text-gray-600 mb-6">Create your first post to get started</p>
            <Link
              href="/dashboard/generate"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition"
            >
              Generate Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-3">
                    {new Date(draft.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <p className="text-gray-800 line-clamp-6 mb-4 whitespace-pre-wrap">
                    {draft.content}
                  </p>
                  <div className="text-xs text-gray-500 mb-4">
                    {draft.content.length} characters • {draft.content.split(/\s+/).length} words
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => handleEdit(draft)}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Edit
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSchedule(draft)}
                      className="text-gray-600 hover:text-primary"
                      title="Schedule"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="text-gray-600 hover:text-red-600"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {selectedDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Edit Draft</h2>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <div className="mt-2 text-sm text-gray-500">
                {editContent.length} characters • {editContent.split(/\s+/).length} words
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDraft(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
