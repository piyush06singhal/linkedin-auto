import Link from 'next/link'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold">LinkedAI</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/features" className="hover:text-primary">Features</Link>

            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
            <Link href="/signup" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 animate-fade-in overflow-hidden relative">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm mb-6 font-medium animate-scale-in shadow-lg">
            ✨ Join 10,000+ Professionals Growing on LinkedIn
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            Your LinkedIn Growth,<br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Powered by AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-slide-up leading-relaxed">
            Stop spending hours crafting posts. Let our AI create engaging content that sounds like you, 
            schedule it automatically, and watch your influence grow while you focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-slide-up">
            <Link href="/signup" className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-full text-lg font-medium hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Free - No Credit Card →
            </Link>
            <button className="border-2 border-primary text-primary px-10 py-5 rounded-full text-lg font-medium hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105">
              ▶ See How It Works
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-12 animate-slide-up">14-day free trial • Cancel anytime • No credit card required</p>
          
          {/* Dashboard Preview */}
          <div className="max-w-5xl mx-auto mt-12">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-3xl font-bold text-primary">1,247</div>
                    <div className="text-sm text-gray-600">Posts Generated</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-3xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-gray-600">Engagement</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-3xl font-bold text-purple-600">14</div>
                    <div className="text-sm text-gray-600">Scheduled</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-3xl font-bold text-orange-600">+156%</div>
                    <div className="text-sm text-gray-600">Reach</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to dominate LinkedIn</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Content Generation</h3>
              <p className="text-gray-600">Create engaging posts in seconds with our advanced AI that understands your voice and industry.</p>
            </div>

            <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">Schedule posts at optimal times for maximum engagement. Set it and forget it.</p>
            </div>

            <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">Track performance, understand what works, and optimize your content strategy.</p>
            </div>

            <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Template Library</h3>
              <p className="text-gray-600">Save and reuse your best-performing content with our template system.</p>
            </div>

            <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Draft Management</h3>
              <p className="text-gray-600">Save, edit, and organize your drafts before publishing.</p>
            </div>

            <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Auto-Publishing</h3>
              <p className="text-gray-600">Connect your LinkedIn and let us handle the posting automatically.</p>
            </div>
          </div>
        </div>
      </section>



      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">About LinkedAI</h2>
            <p className="text-xl text-gray-600 mb-8">
              We're on a mission to help professionals grow their LinkedIn presence through the power of AI. 
              Our platform combines cutting-edge artificial intelligence with deep understanding of social media 
              best practices to help you create content that truly resonates.
            </p>
            <p className="text-lg text-gray-600">
              Founded in 2024, we've helped thousands of professionals save time and increase their LinkedIn 
              engagement by up to 10x. Join us in revolutionizing professional content creation.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-gray-600">Tips, tricks, and insights for LinkedIn success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">Dec 10, 2024</div>
                <h3 className="text-xl font-bold mb-2">10 Tips for Better LinkedIn Engagement</h3>
                <p className="text-gray-600 mb-4">Learn how to create posts that get more likes, comments, and shares.</p>
                <Link href="#" className="text-primary font-medium hover:underline">Read more →</Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500"></div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">Dec 8, 2024</div>
                <h3 className="text-xl font-bold mb-2">How AI is Changing Content Creation</h3>
                <p className="text-gray-600 mb-4">Discover the future of professional content with AI assistance.</p>
                <Link href="#" className="text-primary font-medium hover:underline">Read more →</Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500"></div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">Dec 5, 2024</div>
                <h3 className="text-xl font-bold mb-2">Best Times to Post on LinkedIn</h3>
                <p className="text-gray-600 mb-4">Data-driven insights on when your audience is most active.</p>
                <Link href="#" className="text-primary font-medium hover:underline">Read more →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
