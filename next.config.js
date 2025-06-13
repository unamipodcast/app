/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  transpilePackages: ['firebase', '@firebase/auth'],
  experimental: {
    serverComponentsExternalPackages: ['firebase', '@firebase/auth']
  }
}

module.exports = nextConfig