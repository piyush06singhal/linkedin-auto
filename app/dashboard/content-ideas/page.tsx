'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

interface ContentIdea {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  engagement: string
  trending: boolean
}

export default function ContentIdeasPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const categories = ['All', 'Thought Leadership', 'Personal Story', 'Industry News', 'Tips & Tricks', 'Career Advice', 'Trending Topics']
  
  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleGenerateMore = async () => {
    if (cooldown > 0) {
      alert(`Please wait ${cooldown} seconds before generating more ideas.`)
      return
    }
    
    setGenerating(true)
    
    try {
      console.log('🚀 Generating AI content ideas...')
      
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          count: 6 // Generate 6 ideas at a time (more efficient, unlimited total)
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle rate limit errors
        if (response.status === 429) {
          setCooldown(60) // Set 60 second cooldown for quota errors
        }
        throw new Error(data.error || 'Failed to generate ideas')
      }

      console.log('✅ Received', data.ideas.length, 'ideas from AI')
      
      // Filter out duplicate ideas based on title similarity
      setIdeas(prevIdeas => {
        const existingTitles = new Set(prevIdeas.map(idea => idea.title.toLowerCase().trim()))
        const newUniqueIdeas = data.ideas.filter((idea: ContentIdea) => 
          !existingTitles.has(idea.title.toLowerCase().trim())
        )
        
        if (newUniqueIdeas.length < data.ideas.length) {
          console.log(`⚠️ Filtered out ${data.ideas.length - newUniqueIdeas.length} duplicate ideas`)
        }
        
        return [...prevIdeas, ...newUniqueIdeas]
      })
      
      // Set a 5 second cooldown after successful generation to avoid rate limits
      setCooldown(5)
    } catch (error: any) {
      console.error('❌ Error generating ideas:', error)
      alert(error.message || 'Failed to generate ideas. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredIdeas = selectedCategory === 'All' 
    ? ideas 
    : ideas.filter(idea => idea.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'Easy': 'bg-green-50 text-green-700 border-green-200',
      'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Hard': 'bg-red-50 text-red-700 border-red-200'
    }
    return colors[difficulty] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const getEngagementColor = (engagement: string) => {
    const colors: Record<string, string> = {
      'Very High': 'bg-purple-50 text-purple-700 border-purple-200',
      'High': 'bg-blue-50 text-blue-700 border-blue-200',
      'Medium': 'bg-orange-50 text-orange-700 border-orange-200'
    }
    return colors[engagement] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Content Ideas</h1>
                  <p className="text-gray-500 mt-1">AI-powered content suggestions to keep your feed active</p>
                </div>
              </div>
              <button
                onClick={handleGenerateMore}
                disabled={generating || cooldown > 0}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>
                  {generating ? 'Generating...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Generate More'}
                </span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-3 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Ideas Grid */}
          {filteredIdeas.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Content Ideas Yet</h3>
              <p className="text-gray-600 mb-6">Click "Generate More" to get AI-powered content suggestions</p>
              <button
                onClick={handleGenerateMore}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                Generate Ideas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map(idea => (
                <div key={idea.id} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition leading-tight">
                          {idea.title}
                        </h3>
                        {idea.trending && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                            </svg>
                            <span>Trending</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{idea.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(idea.difficulty)}`}>
                        {idea.difficulty}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getEngagementColor(idea.engagement)}`}>
                        {idea.engagement} Engagement
                      </span>
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        {idea.category}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/generate?idea=${encodeURIComponent(idea.title + ': ' + idea.description)}`}
                        className="flex-1 bg-primary text-white py-2.5 px-4 rounded-xl font-medium hover:bg-secondary transition shadow-sm text-sm text-center"
                      >
                        Use This Idea
                      </Link>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`${idea.title}\n\n${idea.description}`)
                          alert('Idea copied to clipboard!')
                        }}
                        className="w-10 h-10 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 hover:text-primary transition flex items-center justify-center"
                        title="Copy to clipboard"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pro Tips Section */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pro Tips for Great Content:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Start with a compelling hook that stops the scroll</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Share personal stories and real experiences</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>End with a question to encourage engagement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Post consistently - aim for 3-5 times per week</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      {/* Logout Confirmation Modal */}
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
    </DashboardLayout>
  )
}
