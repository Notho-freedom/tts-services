/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['prisma'],
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'ui-avatars.com']
  }
}

module.exports = nextConfig
