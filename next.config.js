/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-toastify'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
}

module.exports = nextConfig 