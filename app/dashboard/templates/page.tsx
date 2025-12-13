'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'

interface Template {
  id: string
  name: string
  description: string
  category: string
  tone: string
  variables: number
  preview: string
  hashtags: string[]
  icon: string
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Industry Insight',
    description: 'Share your perspective on industry trends',
    category: 'Thought Leadership',
    tone: 'professional',
    variables: 4,
    icon: '💡',
    preview: "I've been thinking a lot about [topic] lately.\n\nHere's what I've learned:\n\n{insight_1}\n{insight_2}\n{insight_3}\n\nWhat's your take on this? I'd love to...",
    hashtags: ['#Leadership', '#Innovation', '#BusinessStrategy']
  },
  {
    id: '2',
    name: 'Engagement Question',
    description: 'Ask thought-provoking questions',
    category: 'Engagement',
    tone: 'casual',
    variables: 2,
    icon: '💬',
    preview: "💬 Quick question for my network:\n\n{question}\n\nI'm curious because {context}\n\nWhat do you think? Drop your thoughts in the comments!",
    hashtags: ['#Discussion', '#Community']
  },
  {
    id: '3',
    name: 'Opinion Poll',
    description: 'Get opinions from your network',
    category: 'Engagement',
    tone: 'casual',
    variables: 5,
    icon: '📊',
    preview: "📊 I need your input on [topic]:\n\nOption A: {option_a}\nOption B: {option_b}\nOption C: {option_c}\n\nVote in the comments and tell me why!\n\nContext: {context}",
    hashtags: ['#Poll', '#YourOpinion']
  },
  {
    id: '4',
    name: 'Journey Story',
    description: 'Share your professional journey',
    category: 'Storytelling',
    tone: 'inspirational',
    variables: 7,
    icon: '🚀',
    preview: "My journey from [start] to [end]:\n\nWhere I started:\n{beginning}\n\nThe turning point:\n{turning_point}\n\nWhere I am now:\n{current}",
    hashtags: ['#Journey', '#CareerGrowth', '#Inspiration']
  },
  {
    id: '5',
    name: 'Quick Tips',
    description: 'Share actionable tips',
    category: 'Tips',
    tone: 'informative',
    variables: 7,
    icon: '💡',
    preview: "💡 [number] quick tips for [topic]:\n\n🔹 {tip_1}\n🔹 {tip_2}\n🔹 {tip_3}\n🔹 {tip_4}\n🔹 {tip_5}",
    hashtags: ['#Tips', '#Productivity']
  },
  {
    id: '6',
    name: 'Resource List',
    description: 'Curated list of resources',
    category: 'Tips',
    tone: 'informative',
    variables: 10,
    icon: '📚',
    preview: "📚 Top [number] resources for [topic]:\n\n1. {resource_1} - {description_1}\n2. {resource_2} - {description_2}\n3. {resource_3} - {description_3}\n\nAll are...",
    hashtags: ['#Resources', '#Learning']
  },
  {
    id: '7',
    name: 'Story with Lesson',
    description: 'Share personal story with takeaway',
    category: 'Storytelling',
    tone: 'inspirational',
    variables: 5,
    icon: '📖',
    preview: "[timeframe] ago, [situation]\n\nI learned {lesson}\n\nHere's what happened:\n\n{story}\n\nThe takeaway?\n{takeaway}",
    hashtags: ['#Lessons', '#Growth', '#Story']
  },
  {
    id: '8',
    name: 'Product Launch',
    description: 'Announce new product or feature',
    category: 'Announcement',
    tone: 'professional',
    variables: 6,
    icon: '🚀',
    preview: "🚀 Launching {product_name}!\n\nWe built this to solve {problem}\n\nKey features:\n✅ {feature_1}\n✅ {feature_2}\n✅ {feature_3}\n\n{cta}",
    hashtags: ['#ProductLaunch', '#Innovation']
  },
  {
    id: '9',
    name: 'How-To Guide',
    description: 'Step-by-step guide or tutorial',
    category: 'Educational',
    tone: 'informative',
    variables: 6,
    icon: '📖',
    preview: "📖 How to {goal}:\n\nStep 1: {step_1}\nStep 2: {step_2}\nStep 3: {step_3}\nStep 4: {step_4}\n\nPro tip: {pro_tip}\n\nHave you tried this approach? What worked...",
    hashtags: ['#Tutorial', '#Learning', '#Tips']
  },
  {
    id: '10',
    name: 'Common Mistakes',
    description: 'Highlight mistakes and solutions',
    category: 'Educational',
    tone: 'informative',
    variables: 8,
    icon: '❌',
    preview: "❌ {number} mistakes I see in {domain}:\n\n1. {mistake_1}\n   ✅ Instead: {solution_1}\n\n2. {mistake_2}\n   ✅ Instead: {solution_2}\n\n3. {mistake_3}\n   ✅ Instead...",
    hashtags: ['#Mistakes', '#Learning']
  },
  {
    id: '11',
    name: 'Milestone Announcement',
    description: 'Celebrate achievements and milestones',
    category: 'Announcement',
    tone: 'professional',
    variables: 3,
    icon: '🎉',
    preview: "🎉 Exciting news!\n\n{announcement}\n\nThis wouldn't have been possible without:\n{acknowledgment}\n\nGrateful for this journey and excited for what's next...",
    hashtags: ['#Milestone', '#Growth', '#Success']
  },
  {
    id: '12',
    name: 'Future Prediction',
    description: 'Share predictions about industry future',
    category: 'Thought Leadership',
    tone: 'professional',
    variables: 6,
    icon: '🔮',
    preview: "🔮 My prediction for {industry} in {year}:\n\n{prediction}\n\nWhy I believe this:\n• {reason_1}\n• {reason_2}\n• {reason_3}\n\nAgree or disagree? Let's discuss...",
    hashtags: ['#FutureTrends', '#Innovation']
  }
]

const categories = [
  'All Categories',
  'Thought Leadership',
  'Engagement',
  'Storytelling',
  'Tips',
  'Announcement',
  'Educational'
]

export default function TemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Thought Leadership': 'bg-purple-50 text-purple-700 border-purple-200',
      'Engagement': 'bg-orange-50 text-orange-700 border-orange-200',
      'Storytelling': 'bg-pink-50 text-pink-700 border-pink-200',
      'Tips': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Announcement': 'bg-blue-50 text-blue-700 border-blue-200',
      'Educational': 'bg-green-50 text-green-700 border-green-200'
    }
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Post Templates</h1>
                <p className="text-gray-500 mt-1">Start with proven templates and customize</p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map(template => (
              <div key={template.id} className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition">{template.name}</h3>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium border ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.description}</p>
                  
                  {/* Preview Box */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 relative overflow-hidden" style={{ maxHeight: '140px' }}>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{template.preview}</pre>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">{template.tone}</span>
                    <span className="text-gray-500">{template.variables} variables</span>
                  </div>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {template.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-blue-600 font-medium">{tag}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/generate?template=${encodeURIComponent(template.preview)}&name=${encodeURIComponent(template.name)}`}
                      className="flex-1 bg-primary text-white py-2.5 px-4 rounded-xl font-medium hover:bg-secondary transition shadow-sm text-center"
                    >
                      Use Template
                    </Link>
                    <button 
                      onClick={() => setSelectedTemplate(template)}
                      className="w-11 h-11 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 hover:text-primary transition flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTemplate(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{selectedTemplate.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h2>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(selectedTemplate.category)}`}>
                        {selectedTemplate.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{selectedTemplate.tone}</span>
                      <span className="text-sm text-gray-500">{selectedTemplate.variables} variables</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Template Preview</h3>
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{selectedTemplate.preview}</pre>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Suggested Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.hashtags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/dashboard/generate?template=${encodeURIComponent(selectedTemplate.preview)}&name=${encodeURIComponent(selectedTemplate.name)}`}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-secondary transition shadow-lg text-center"
                >
                  Use This Template
                </Link>
                <button onClick={() => setSelectedTemplate(null)} className="px-8 py-4 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
