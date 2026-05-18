import Link from "next/link";
import Footer from "@/components/Footer";

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
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <Link href="/features" className="hover:text-primary">
              Features
            </Link>

            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="border-2 border-primary text-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-medium"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden relative">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-gradient-to-r from-indigo-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            Your LinkedIn Growth,
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-slide-up leading-relaxed">
            Stop spending hours crafting posts. Let our AI create engaging
            content that sounds like you, schedule it automatically, and watch
            your influence grow while you focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-slide-up">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-full text-lg font-medium hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to dominate LinkedIn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                AI Content Generation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create engaging posts in seconds with our advanced AI that
                understands your voice and industry.
              </p>
            </div>

            <div className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Smart Scheduling
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Schedule posts at optimal times for maximum engagement. Set it
                and forget it.
              </p>
            </div>

            <div className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Analytics & Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track performance, understand what works, and optimize your
                content strategy.
              </p>
            </div>

            <div className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Template Library
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Save and reuse your best-performing content with our template
                system.
              </p>
            </div>

            <div className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-rose-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Draft Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Save, edit, and organize your drafts before publishing.
              </p>
            </div>

            <div className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Auto-Publishing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect your LinkedIn and let us handle the posting
                automatically.
              </p>
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
              We're on a mission to help professionals grow their LinkedIn
              presence through the power of AI. Our platform combines
              cutting-edge artificial intelligence with deep understanding of
              social media best practices to help you create content that truly
              resonates.
            </p>
            <p className="text-lg text-gray-600">
              Founded in 2024, we've helped thousands of professionals save time
              and increase their LinkedIn engagement by up to 10x. Join us in
              revolutionizing professional content creation.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
