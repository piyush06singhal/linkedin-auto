'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  content: string
  category: string
  created_at: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: 'general',
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setTemplates(data)
    }
    setLoading(false)
  }

  const handleCreateTemplate = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('templates').insert({
      user_id: user.id,
      name: newTemplate.name,
      content: newTemplate.content,
      category: newTemplate.category,
    })

    if (!error) {
      setShowCreateModal(false)
      setNewTemplate({ name: '', content: '', category: 'general' })
      fetchTemplates()
    }
  }

  const handleUseTemplate = async (template: Template) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('posts').insert({
      user_id: user.id,
      content: template.content,
      status: 'draft',
    })

    router.push('/dashboard/drafts')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return
    await supabase.from('templates').delete().eq('id', id)
    fetchTemplates()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/dashboard/templates" className="text-primary font-medium">Templates</Link>
              <Link href="/dashboard/drafts" className="text-gray-600 hover:text-primary">Drafts</Link>
              <Link href="/dashboard/calendar" className="text-gray-600 hover:text-primary">Calendar</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Templates</h1>
            <p className="text-gray-600">{templates.length} saved templates</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition"
          >
            + Create Template
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No templates yet</h3>
            <p className="text-gray-600 mb-6">Create reusable templates for faster content creation</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition"
            >
              Create Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{template.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-4 whitespace-pre-wrap mb-4">
                    {template.content}
                  </p>
                  <div className="text-xs text-gray-500">
                    {template.content.length} characters
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Create Template</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Weekly Tips Template"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="tips">Tips</option>
                  <option value="story">Story</option>
                  <option value="announcement">Announcement</option>
                  <option value="question">Question</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Enter your template content..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={!newTemplate.name || !newTemplate.content}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
