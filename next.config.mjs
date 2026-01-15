/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  images: {
    // ImageKit کی تصاویر کو اجازت دینے کے لیے یہ حصہ ضروری ہے
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
        pathname: '/**',
      },
    ],
  },

  compress: true,

  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@heroicons/react',
      'react-hook-form',
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

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