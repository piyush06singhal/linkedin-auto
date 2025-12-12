'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'

export default function ViralPredictorPage() {
  const [content, setContent] = useState('')
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const analyzePrediction = async () => {
    setLoading(true)

    try {
      console.log('🔍 Analyzing post with AI...')
      console.log('📝 Content:', content)

      const response = await fetch('/api/analyze-viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze')
      }

      console.log('✅ AI Analysis complete:', data)
      setPrediction(data.prediction)
    } catch (error: any) {
      console.error('❌ Analysis error:', error)
      alert(error.message || 'Failed to analyze post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-3xl font-bold">Viral Predictor</h1>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          </div>
          <p className="text-gray-600">Predict how well your post will perform before publishing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Analyze Your Post</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your LinkedIn post here..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none mb-4"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {content.length} characters • {content.split(/\s+/).filter(w => w).length} words
              </span>
              <button
                onClick={analyzePrediction}
                disabled={loading || !content.trim()}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Predict Performance'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {prediction ? (
              <>
                {/* Score */}
                <div className="bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Viral Score</h3>
                  <div className="text-5xl font-bold mb-2">{prediction.score}</div>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all"
                      style={{ width: `${prediction.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-white/90">
                    {prediction.score >= 90
                      ? 'Excellent! High viral potential'
                      : prediction.score >= 75
                      ? 'Good! Should perform well'
                      : 'Needs improvement'}
                  </p>
                </div>

                {/* Predictions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold mb-4">Predicted Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Engagement</span>
                      <span className="font-bold">{prediction.engagement}+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Reach</span>
                      <span className="font-bold">{prediction.reach.toLocaleString()}+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Best Time</span>
                      <span className="font-bold text-sm">{prediction.bestTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Best Day</span>
                      <span className="font-bold text-sm">{prediction.bestDay}</span>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold mb-4">💡 AI Suggestions</h3>
                  <ul className="space-y-2">
                    {prediction.suggestions?.map((suggestion: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strengths & Weaknesses */}
                {(prediction.strengths || prediction.weaknesses) && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {prediction.strengths && prediction.strengths.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-bold mb-2 text-green-600">✓ Strengths</h3>
                        <ul className="space-y-1">
                          {prediction.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-500 mr-2">+</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {prediction.weaknesses && prediction.weaknesses.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-2 text-orange-600">⚠ Areas to Improve</h3>
                        <ul className="space-y-1">
                          {prediction.weaknesses.map((weakness: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start">
                              <span className="text-orange-500 mr-2">-</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-gray-600">Enter your post content to see predictions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
