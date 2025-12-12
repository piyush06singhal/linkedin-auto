import Link from 'next/link'
import Footer from '@/components/Footer'

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold">LinkedAI</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/features" className="text-primary font-medium">Features</Link>

            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="border-2 border-primary text-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-medium">
              Log in
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 font-medium">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 animate-fade-in">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-6 font-medium animate-scale-in">
            🚀 All-in-One LinkedIn Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">Powerful Features for LinkedIn Success</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up">
            Everything you need to dominate LinkedIn and build your professional brand with cutting-edge AI technology
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-slide-up">
            
            {/* AI Content Generation */}
            <div className="flex gap-6 group hover:bg-blue-50 p-6 rounded-2xl transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">AI Content Generation</h3>
                <p className="text-gray-600 mb-4">
                  Our advanced AI analyzes your industry, writing style, and audience preferences to create 
                  authentic posts that sound like you. No more writer's block or generic content.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Multiple content formats (tips, stories, questions)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Industry-specific knowledge base
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Tone and style customization
                  </li>
                </ul>
              </div>
            </div>

            {/* Smart Scheduling */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Smart Scheduling</h3>
                <p className="text-gray-600 mb-4">
                  Schedule posts weeks in advance with our intelligent calendar. The system suggests optimal 
                  posting times based on when your audience is most active.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Best time recommendations
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Bulk scheduling for multiple posts
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Calendar view with drag-and-drop
                  </li>
                </ul>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Deep Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Track every metric that matters. Understand what content performs best and continuously 
                  improve your LinkedIn strategy with data-driven insights.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Engagement rate tracking
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Follower growth analytics
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Content performance comparison
                  </li>
                </ul>
              </div>
            </div>

            {/* AI Image Generator */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">AI Image Generator</h3>
                <p className="text-gray-600 mb-4">
                  Create stunning visuals for your posts without design skills. Generate professional images 
                  that complement your content and boost engagement.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Multiple artistic styles
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Custom dimensions for LinkedIn
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Brand color integration
                  </li>
                </ul>
              </div>
            </div>

            {/* Template Library */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Template Library</h3>
                <p className="text-gray-600 mb-4">
                  Save your best-performing posts as templates. Build a library of proven content frameworks 
                  that you can reuse and adapt for different topics.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Unlimited template storage
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Category organization
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    One-click template application
                  </li>
                </ul>
              </div>
            </div>

            {/* Viral Predictor */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Viral Predictor</h3>
                <p className="text-gray-600 mb-4">
                  Before you post, get an AI-powered prediction of how well your content will perform. 
                  Optimize your posts for maximum reach and engagement.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Engagement score prediction
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Improvement suggestions
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Hashtag recommendations
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your LinkedIn?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals growing their presence</p>
          <Link href="/signup" className="inline-block bg-white text-primary px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition">
            Start Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
