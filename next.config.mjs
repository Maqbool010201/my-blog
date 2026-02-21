/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },

  compress: true,

  experimental: {
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

  async redirects() {
    return [
      {
        source: '/why-hair-falls-out-on-the-keto-diet-and-how-to-prevent-it',
        destination: '/tools/image-resizer',
        permanent: true,
      },
      {
        source: '/blogs/why-hair-falls-out-on-the-keto-diet-and-how-to-prevent-it',
        destination: '/tools/image-resizer',
        permanent: true,
      },
      {
        source: '/keto-diet-for-weight-gain-expert-tips-supplements-and-common-questions',
        destination: '/tools/image-compressor',
        permanent: true,
      },
      // نوٹ: ہم نے یہاں سے /category/:path* والی ری ڈائریکٹ ہٹا دی ہے تاکہ آپ کی نئی کیٹیگریز کام کریں
    ];
  },

  async headers() {
    return [
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
