'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NotificationPreferences {
  email_notifications: boolean
  push_notifications: boolean
  post_published: boolean
  post_failed: boolean
  post_scheduled: boolean
  workspace_invites: boolean
  member_joined: boolean
}

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    push_notifications: true,
    post_published: true,
    post_failed: true,
    post_scheduled: true,
    workspace_invites: true,
    member_joined: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences')
      const data = await response.json()

      if (data.success && data.preferences) {
        setPreferences(data.preferences)
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Preferences saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      setMessage('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

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

          <Link href="/dashboard/notifications" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Notifications</span>
          </Link>

          <div className="pt-4 border-t border-gray-200 mt-4">
            <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard/notifications" className="text-primary hover:underline mb-4 inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Notifications
            </Link>
            <div className="flex items-center space-x-4 mt-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Notification Preferences</h1>
                <p className="text-gray-500 mt-1">Manage how you receive notifications</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl ${
              message.includes('success') 
                ? 'bg-green-50 text-green-800 border-2 border-green-200' 
                : 'bg-red-50 text-red-800 border-2 border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* General Settings */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => togglePreference('email_notifications')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.email_notifications ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    preferences.email_notifications ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive in-app notifications</p>
                </div>
                <button
                  onClick={() => togglePreference('push_notifications')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.push_notifications ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    preferences.push_notifications ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Post Notifications */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Post Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Post Published</h3>
                    <p className="text-sm text-gray-600">When your post is successfully published</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('post_published')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.post_published ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    preferences.post_published ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Post Failed</h3>
                    <p className="text-sm text-gray-600">When a post fails to publish</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('post_failed')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.post_failed ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    preferences.post_failed ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Post Scheduled</h3>
                    <p className="text-sm text-gray-600">When a post is scheduled for later</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('post_scheduled')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.post_scheduled ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    preferences.post_scheduled ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Workspace Notifications */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Workspace Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Workspace Invites</h3>
                    <p className="text-sm text-gray-600">When you're invited to a workspace</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('workspace_invites')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.workspace_invites ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    preferences.workspace_invites ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Member Joined</h3>
                    <p className="text-sm text-gray-600">When someone joins your workspace</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('member_joined')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.member_joined ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    preferences.member_joined ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={savePreferences}
              disabled={saving}
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
