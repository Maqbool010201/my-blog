/** @type {import('next').NextConfig} */
const nextConfig = {
  // تصاویر کی سیٹنگز (ImageKit اور فارمیٹس)
  images: {
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

  // ڈیٹا کمپریشن (سائٹ اسپیڈ کے لیے)
  compress: true,

  // پیکجز کو آپٹمائز کرنا
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@heroicons/react',
      'react-hook-form',
    ],
  },

  // پروڈکشن میں کنسول لاگز ہٹانا
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // کیشنگ اور سیکیورٹی ہیڈرز (اپ لوڈز اور API کے لیے)
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

// یہ لائن سب سے اہم ہے (CommonJS format)
module.exports = nextConfig;