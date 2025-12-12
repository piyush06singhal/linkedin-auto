import Link from 'next/link'
import Footer from '@/components/Footer'

// Static stats for instant page load - update these periodically
const stats = {
  activeUsers: 10000,
  postsGenerated: 500000,
  industries: 50,
  satisfactionRate: 95
}

export default function AboutPage() {
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
            <Link href="/features" className="hover:text-primary">Features</Link>

            <Link href="/about" className="text-primary font-medium">About</Link>
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
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Mission</h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
            Empowering professionals to build authentic connections and grow their influence on LinkedIn
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Our Story</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                LinkedAI was born from a simple observation: talented professionals were struggling to maintain 
                a consistent presence on LinkedIn. They had valuable insights to share but lacked the time to 
                create engaging content regularly.
              </p>
              <p>
                In 2024, our founders—experienced marketers and AI engineers—came together with a vision: 
                what if we could combine the power of artificial intelligence with deep understanding of 
                professional networking to help people share their expertise effortlessly?
              </p>
              <p>
                Today, LinkedAI serves thousands of professionals across 50+ industries, helping them save 
                hours each week while growing their LinkedIn presence by an average of 300%. But we're just 
                getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Authenticity</h3>
              <p className="text-gray-600">
                We believe AI should enhance your voice, not replace it. Every piece of content reflects your 
                unique perspective and expertise.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-600">
                We're constantly pushing the boundaries of what's possible with AI, always staying ahead of 
                the curve in content technology.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Community</h3>
              <p className="text-gray-600">
                Your success is our success. We're building a community of professionals who support and 
                learn from each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2">10K+</div>
              <p className="text-lg opacity-90">Active Users</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2">500K+</div>
              <p className="text-lg opacity-90">Posts Generated</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-lg opacity-90">Industries Served</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2">95%</div>
              <p className="text-lg opacity-90">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Us on This Journey</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of the future of professional content creation
          </p>
          <Link href="/signup" className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-secondary transition">
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
