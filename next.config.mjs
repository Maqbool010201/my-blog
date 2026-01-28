/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // --- ری ڈائریکٹس یہاں سے شروع ہوتے ہیں ---
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
      {
        source: '/category/:path*',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/blogs',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/blogs/',
        destination: '/tools',
        permanent: true,
      }
    ];
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