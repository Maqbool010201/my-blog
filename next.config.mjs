/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Image Configuration (Updated for Custom Loader)
  images: {
    // لوکل ہوسٹ پر پاتھ سے امیج فیچ کرنے کے لیے یہ دو لائنیں لازمی ہیں
    loader: 'custom',
    loaderFile: './src/lib/imagekitLoader.js',
    
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/ag0dicbdub/**',
      },
    ],
  },

  // 2. Performance & Optimizations
  compress: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@heroicons/react',
      'react-hook-form',
    ],
  },

  // 3. Environment Specifics
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 4. Security & Caching Headers
  async headers() {
    return [
      {
        source: '/uploads/:year/:month/:day/:file',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;