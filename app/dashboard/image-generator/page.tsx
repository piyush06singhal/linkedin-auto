'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('professional')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [generatedImage, setGeneratedImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          prompt,
          style,
          aspectRatio,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      setGeneratedImage(data.result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `linkedin-image-${Date.now()}.png`
    link.click()
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Image Finder</h1>
          <p className="text-gray-600">Find professional stock photos for your LinkedIn posts from Unsplash</p>
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This searches Unsplash's stock photo library for images matching your keywords. 
              It doesn't generate custom AI images. For best results, use simple keywords like "business meeting", "technology", "teamwork", etc.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-6">
              <h2 className="text-lg font-bold mb-4">Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Prompt *
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A professional team collaborating in a modern office"
                    className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="minimal">Minimal</option>
                    <option value="vibrant">Vibrant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1:1', '16:9', '4:5'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          aspectRatio === ratio
                            ? 'border-primary bg-blue-50 text-primary font-medium'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Generate Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Generated Image</h2>
                {generatedImage && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {generatedImage ? (
                <div className="relative">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No image yet</p>
                  <p className="text-sm">Enter a prompt and click "Generate Image"</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-medium text-blue-900 mb-2">💡 Tips for better images</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific: "Modern office with diverse team" vs "office"</li>
                <li>• Include mood: "energetic", "calm", "professional"</li>
                <li>• Mention colors: "blue and white color scheme"</li>
                <li>• Add context: "for LinkedIn post about teamwork"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
