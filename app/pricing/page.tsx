import Link from 'next/link'
import Footer from '@/components/Footer'

export default function PricingPage() {
  const features = [
    { name: 'AI-Generated Posts', starter: '10/month', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'AI Image Generation', starter: false, pro: '50/month', enterprise: 'Unlimited' },
    { name: 'Content Templates', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Post Scheduling', starter: 'Manual', pro: 'Smart Auto', enterprise: 'Smart Auto' },
    { name: 'Analytics Dashboard', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced + Custom' },
    { name: 'Viral Predictor', starter: false, pro: true, enterprise: true },
    { name: 'Lead Generation', starter: false, pro: true, enterprise: true },
    { name: 'Draft Management', starter: true, pro: true, enterprise: true },
    { name: 'Calendar View', starter: true, pro: true, enterprise: true },
    { name: 'Email Notifications', starter: false, pro: true, enterprise: true },
    { name: 'Team Members', starter: '1', pro: '1', enterprise: '5' },
    { name: 'Custom AI Training', starter: false, pro: false, enterprise: true },
    { name: 'Priority Support', starter: false, pro: 'Email', enterprise: '24/7 Phone + Email' },
    { name: 'Dedicated Account Manager', starter: false, pro: false, enterprise: true },
    { name: 'API Access', starter: false, pro: false, enterprise: true },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold">LinkedAI</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <Link href="/features" className="hover:text-primary transition">Features</Link>
            <Link href="/pricing" className="text-primary font-medium">Pricing</Link>
            <Link href="/about" className="hover:text-primary transition">About</Link>
            <Link href="/blog" className="hover:text-primary transition">Blog</Link>
            <Link href="/contact" className="hover:text-primary transition">Contact</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
            <Link href="/signup" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition shadow-lg hover:shadow-xl">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 animate-fade-in">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-6 font-medium animate-scale-in">
            💰 14-Day Money-Back Guarantee
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">Choose Your Growth Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up">
            Start free, upgrade when you're ready. All plans include core features to boost your LinkedIn presence.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Starter Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-5xl font-bold mb-2">$0</div>
                <p className="text-gray-600">Perfect to get started</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>10</strong> AI-generated posts/month</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>3</strong> content templates</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Manual scheduling</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Draft management</span>
                </li>
              </ul>
              <Link href="/signup" className="block w-full text-center bg-gray-100 text-gray-800 py-4 rounded-xl font-medium hover:bg-gray-200 transition">
                Get Started Free
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-3xl p-8 relative shadow-2xl transform scale-105 hover:scale-110 transition-all duration-300">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                ⭐ MOST POPULAR
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="text-5xl font-bold mb-2">$29</div>
                <p className="opacity-90">Best for professionals</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Unlimited</strong> AI posts</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>50</strong> AI images/month</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced analytics & insights</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Unlimited</strong> templates</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart auto-scheduling</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Viral predictor access</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority email support</span>
                </li>
              </ul>
              <Link href="/signup" className="block w-full text-center bg-white text-primary py-4 rounded-xl font-medium hover:bg-gray-100 transition shadow-lg">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="text-5xl font-bold mb-2">$99</div>
                <p className="text-gray-600">For teams & agencies</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>5</strong> team member accounts</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Unlimited</strong> AI images</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Custom AI training on your brand</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>24/7 priority support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>API access</span>
                </li>
              </ul>
              <Link href="/contact" className="block w-full text-center bg-primary text-white py-4 rounded-xl font-medium hover:bg-secondary transition shadow-lg">
                Contact Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Detailed Plan Comparison</h2>
            <p className="text-xl text-gray-600">See exactly what's included in each plan</p>
          </div>
          
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-900">Starter</th>
                  <th className="px-6 py-4 text-center font-bold text-primary bg-blue-50">Professional</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{feature.name}</td>
                    <td className="px-6 py-4 text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <svg className="w-6 h-6 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )
                      ) : (
                        <span className="text-gray-700">{feature.starter}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50/50">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <svg className="w-6 h-6 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )
                      ) : (
                        <span className="text-primary font-medium">{feature.pro}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <svg className="w-6 h-6 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )
                      ) : (
                        <span className="text-gray-700">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes! You can cancel your subscription at any time with no questions asked and no cancellation fees. Your access continues until the end of your billing period.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied within the first 14 days, we'll refund your payment in full.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">Absolutely! You can change your plan at any time from your account settings. Upgrades take effect immediately, and downgrades apply at the next billing cycle.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-600">Yes! The Professional plan includes a 14-day free trial. No credit card required to start. For Enterprise, contact our sales team for a custom trial.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
