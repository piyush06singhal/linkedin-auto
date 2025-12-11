import Link from 'next/link'
import Footer from '@/components/Footer'

export default function BlogPage() {
  const posts = [
    {
      title: "10 Proven Strategies to Boost LinkedIn Engagement in 2024",
      excerpt: "Discover the latest tactics that top professionals use to increase their post visibility and drive meaningful conversations.",
      date: "Dec 10, 2024",
      category: "Strategy",
      gradient: "from-blue-400 to-purple-500"
    },
    {
      title: "How AI is Revolutionizing Professional Content Creation",
      excerpt: "Explore how artificial intelligence is changing the game for busy professionals who want to maintain an active LinkedIn presence.",
      date: "Dec 8, 2024",
      category: "Technology",
      gradient: "from-green-400 to-blue-500"
    },
    {
      title: "The Science Behind Viral LinkedIn Posts",
      excerpt: "We analyzed 10,000 top-performing posts to uncover the patterns that make content go viral on LinkedIn.",
      date: "Dec 5, 2024",
      category: "Research",
      gradient: "from-orange-400 to-red-500"
    },
    {
      title: "Best Times to Post on LinkedIn: Data-Driven Insights",
      excerpt: "When is your audience most active? Our comprehensive study reveals the optimal posting schedule for maximum reach.",
      date: "Dec 3, 2024",
      category: "Analytics",
      gradient: "from-pink-400 to-purple-500"
    },
    {
      title: "Building Your Personal Brand: A Complete Guide",
      excerpt: "Learn how to craft a compelling personal brand that attracts opportunities and establishes you as a thought leader.",
      date: "Nov 30, 2024",
      category: "Branding",
      gradient: "from-indigo-400 to-blue-500"
    },
    {
      title: "LinkedIn Algorithm Changes: What You Need to Know",
      excerpt: "Stay ahead of the curve with our breakdown of recent algorithm updates and how they affect your content strategy.",
      date: "Nov 28, 2024",
      category: "Updates",
      gradient: "from-teal-400 to-green-500"
    }
  ]

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
            <Link href="/pricing" className="hover:text-primary">Pricing</Link>
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/blog" className="text-primary font-medium">Blog</Link>
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">LinkedIn Growth Insights</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert tips, strategies, and insights to help you master LinkedIn and grow your professional presence
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition group">
                <div className={`h-48 bg-gradient-to-br ${post.gradient}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link href="#" className="text-primary font-medium hover:underline inline-flex items-center">
                    Read more 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">Get the latest LinkedIn tips and strategies delivered to your inbox</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
