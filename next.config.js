/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output to avoid Windows symlink permission issues
  // output: 'standalone',
  transpilePackages: ['react-toastify'],
  // ✅ FIXED: Updated for Next.js 15 stable
  serverExternalPackages: ['@prisma/client'], // Moved from experimental
  // Disable static generation to avoid Clerk issues during build
  trailingSlash: false,
  generateEtags: false,
  turbopack: {
    // ✅ FIXED: Moved from experimental.turbo
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  experimental: {
    // ✅ FIXED: Only keep valid experimental features
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    domains: ['randomuser.me'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
          },
        },
      };
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
}

module.exports = nextConfig;
