/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-toastify'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
}

module.exports = nextConfig
