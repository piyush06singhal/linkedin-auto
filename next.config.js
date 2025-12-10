/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Ensure CSS is properly processed
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
