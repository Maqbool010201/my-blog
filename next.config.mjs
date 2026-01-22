/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Image Configuration (Updated for Custom Loader)
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imagekitLoader.js',
    formats: ['image/avif', 'image/webp'],
    // remotePatterns کو مزید وسیع کریں تاکہ کسی بھی ذیلی فولڈر (sub-folder) کو قبول کرے
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**', // اسے صرف /** کر دیں تاکہ تمام فولڈرز قبول ہوں
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