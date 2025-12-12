'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function WorkspaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [workspace, setWorkspace] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviting, setInviting] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string>('')

  useEffect(() => {
    params.then(p => {
      setWorkspaceId(p.id)
      fetchWorkspaceDetails(p.id)
      fetchMembers(p.id)
    })
  }, [])

  const fetchWorkspaceDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/workspaces/${id}`)
      const data = await response.json()

      if (data.success) {
        setWorkspace(data.workspace)
      }
    } catch (error) {
      console.error('Error fetching workspace:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async (id: string) => {
    try {
      const response = await fetch(`/api/workspaces/${id}/members`)
      const data = await response.json()

      if (data.success) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address')
      return
    }

    setInviting(true)

    try {
      console.log('Sending invitation to:', inviteEmail, 'with role:', inviteRole)
      console.log('Workspace ID:', workspaceId)
      
      const response = await fetch(`/api/workspaces/${workspaceId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole
        })
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error
        throw new Error(errorMsg || 'Failed to send invitation')
      }

      alert(`✅ Invitation sent to ${inviteEmail}`)
      setShowInviteModal(false)
      setInviteEmail('')
      setInviteRole('editor')

    } catch (error: any) {
      console.error('Invitation error:', error)
      alert(error.message || 'Failed to send invitation')
    } finally {
      setInviting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Workspace not found</h2>
          <Link href="/dashboard/workspace" className="text-primary hover:underline">
            Back to Workspaces
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/workspace" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Workspaces
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{workspace.name}</h1>
                <p className="text-gray-500 mt-1">{workspace.description || 'No description'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Invite Member</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'overview'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'members'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'settings'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Workspace Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{members.length}</div>
                    <div className="text-gray-700">Team Members</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                    <div className="text-gray-700">Posts Created</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                    <div className="text-gray-700">Scheduled Posts</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Team Members</h3>
                <div className="space-y-4">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {member.users?.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-semibold">{member.users?.full_name || member.users?.email}</div>
                          <div className="text-sm text-gray-600">{member.users?.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Workspace Settings</h3>
                <p className="text-gray-600">Settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowInviteModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Invite Team Member</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="viewer">Viewer - Can only view content</option>
                    <option value="editor">Editor - Can create and edit content</option>
                    <option value="admin">Admin - Can manage members and settings</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50"
                >
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
