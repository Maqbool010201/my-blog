import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import Footer from '@/components/Footer/Footer';
import Menu from '@/components/Header/Menu/Menu';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Suspense } from 'react';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: { default: 'Wise Mix Media | Insightful Content', template: '%s | Wise Mix Media' },
  description: 'Expert-written articles on tech and lifestyle.',
  authors: [{ name: 'Maqbool' }],
  metadataBase: new URL('https://www.wisemixmedia.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          {/* Menu Loading Skeleton */}
          <Suspense fallback={<div className="h-16 w-full bg-[#0b1221]" />}>
            <Menu />
          </Suspense>

          <main className="flex-grow w-full">
            {children}
          </main>

          {/* Footer Loading Skeleton - This prevents Layout Shift (CLS) */}
          <Suspense fallback={<div className="h-64 w-full bg-[#0b1221]" />}>
            <Footer />
          </Suspense>
        </Providers>
        <GoogleAnalytics gaId="G-7Z28QL2KWG" />
      </body>
    </html>
  );
}