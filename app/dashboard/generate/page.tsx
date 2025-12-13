'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'

export default function GeneratePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mainTopic, setMainTopic] = useState('')
  const [niche, setNiche] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [description, setDescription] = useState('')
  const [tone, setTone] = useState('professional')
  const [numberOfPosts, setNumberOfPosts] = useState(7)
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if template was passed from templates page
    const template = searchParams.get('template')
    const templateName = searchParams.get('name')
    const idea = searchParams.get('idea')
    
    if (template) {
      setGeneratedPosts([decodeURIComponent(template)])
      if (templateName) {
        setDescription(`Using template: ${decodeURIComponent(templateName)}`)
      }
    }
    
    // Check if content idea was passed
    if (idea) {
      setDescription(decodeURIComponent(idea))
    }
  }, [searchParams])

  const handleGenerate = async () => {
    if (!description.trim() && !mainTopic.trim()) {
      setError('Please provide a topic or description')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedPosts([])

    try {
      const topic = description || `${mainTopic}${niche ? ` - ${niche}` : ''}${targetAudience ? ` for ${targetAudience}` : ''}`
      
      console.log('🎯 User Input - Description:', description)
      console.log('🎯 User Input - Main Topic:', mainTopic)
      console.log('🎯 User Input - Niche:', niche)
      console.log('🎯 User Input - Target Audience:', targetAudience)
      console.log('📝 Final Topic Being Sent to AI:', topic)
      console.log('🎨 Tone:', tone)
      console.log('📊 Number of Posts:', numberOfPosts)
      
      if (!topic || topic.trim().length === 0) {
        throw new Error('Topic is empty. Please provide a description or main topic.')
      }
      
      const posts: string[] = []
      
      // Generate multiple posts based on numberOfPosts
      for (let i = 0; i < numberOfPosts; i++) {
        console.log(`\n🚀 Generating post ${i + 1}/${numberOfPosts}...`)
        
        const requestBody = {
          action: 'generate',
          topic,
          tone,
          length: 'medium',
          includeHashtags: true,
          includeEmojis: tone === 'casual' || tone === 'inspirational',
        }
        
        console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2))
        
        const response = await fetch('/api/generate-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })

        const data = await response.json()
        
        console.log('📥 API Response Status:', response.status)
        console.log('📥 API Response Data:', data)

        if (!response.ok) {
          console.error('❌ API Error:', data.error)
          throw new Error(data.error || 'Failed to generate')
        }

        console.log('✅ Post generated successfully!')
        console.log('📝 Generated content preview:', data.result.substring(0, 100) + '...')
        
        posts.push(data.result)
        
        // Update UI progressively as posts are generated
        setGeneratedPosts([...posts])
        
        // Small delay between requests to avoid rate limiting
        if (i < numberOfPosts - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      
      setGeneratedPosts(posts)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async (content: string) => {
    try {
      const response = await fetch('/api/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          status: 'draft',
        }),
      })

      if (response.ok) {
        alert('Saved to drafts!')
      }
    } catch (err) {
      alert('Failed to save draft')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">AI Content Generator</h1>
                  <p className="text-gray-600">Create engaging LinkedIn posts powered by AI in seconds</p>
                </div>
              </div>

            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
            {/* Description */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <label className="text-lg font-semibold">What do you want to write about?</label>
              </div>
              <p className="text-sm text-gray-500 mb-3">Describe your topic in detail. Be specific about what you want to communicate.</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                placeholder="Example: Write a post about AI in healthcare, focusing on how machine learning helps doctors make better diagnoses. Emphasize patient outcomes and the future of medical technology..."
              />
              <div className="text-xs text-gray-400 mt-1">{description.length} characters • Be as detailed as you like</div>
            </div>

            {/* Specify Your Focus */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-semibold">Specify Your Focus</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Help us understand your content niche better (optional)</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"># Main Topic</label>
                  <input
                    type="text"
                    value={mainTopic}
                    onChange={(e) => setMainTopic(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="e.g., Artificial Intelligence"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Niche/Sub-topic</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="e.g., Healthcare Applications"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">👥 Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="e.g., Healthcare Professionals"
                  />
                </div>
              </div>
            </div>

            {/* Writing Style & Tone */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <h3 className="text-lg font-semibold">Writing Style & Tone</h3>
              </div>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-white"
              >
                <option value="professional">📊 Professional - Clear and business-focused</option>
                <option value="casual">💬 Casual - Friendly and conversational</option>
                <option value="inspirational">✨ Inspirational - Motivating and uplifting</option>
                <option value="educational">📚 Educational - Informative and teaching-focused</option>
              </select>
            </div>

            {/* Number of Posts */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Number of Posts</h3>
                <div className="text-3xl font-bold text-primary">{numberOfPosts}</div>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={numberOfPosts}
                onChange={(e) => setNumberOfPosts(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1</span>
                <span>14</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating {generatedPosts.length}/{numberOfPosts} posts...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate {numberOfPosts} Post{numberOfPosts > 1 ? 's' : ''} with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Posts */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">Generated Posts</h2>
            
            {generatedPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to create?</h3>
                <p className="text-gray-500 mb-6">Add your topics, choose a writing style, and let AI generate engaging LinkedIn posts for you.</p>
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Add topics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Pick style</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Generate</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {generatedPosts.map((post, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-blue-100 text-primary text-sm font-medium rounded-full">Post {index + 1}</span>
                        <span className="text-sm text-gray-500">{post.length} characters</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(post)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => handleSaveDraft(post)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition text-sm font-medium"
                        >
                          Save Draft
                        </button>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">{post}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </DashboardLayout>
  )
}