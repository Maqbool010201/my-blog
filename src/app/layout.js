import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import Footer from '@/components/Footer/Footer';
import Menu from '@/components/Header/Menu/Menu';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Suspense } from 'react';

const geistSans = Geist({ 
  variable: '--font-geist-sans', 
  subsets: ['latin'], 
  display: 'swap' 
});

const geistMono = Geist_Mono({ 
  variable: '--font-geist-mono', 
  subsets: ['latin'], 
  display: 'swap' 
});

export const metadata = {
  title: {
    default: 'Wise Mix Media | Insightful Content for Growth',
    template: '%s | Wise Mix Media',
  },
  description: 'Explore expert-written articles across technology, business, and lifestyle.',
  authors: [{ name: 'Maqbool' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wisemixmedia.com'),
  verification: {
    google: 'E3wAaKlxb0PSG-ooGjBa6CHOnp7RG8tJSC7IJYIsJ_Y',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        {/* Preload matched with StaticHero link */}
        <link 
          rel="preload" 
          as="image" 
          href="https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-1000,q-auto,f-auto" 
          fetchPriority="high"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          {/* Menu Suspense */}
          <Suspense fallback={<div className="h-16 w-full bg-white border-b" />}>
            <Menu />
          </Suspense>

          {/* min-h-screen ensures main content area stays large, preventing footer from jumping up */}
          <main className="flex-grow w-full min-h-[70vh]">
            {children}
          </main>

          {/* Footer Suspense: Important for CLS */}
          <Suspense fallback={<div className="h-64 w-full bg-[#0b1221]" />}>
            <Footer />
          </Suspense>
        </Providers>

        <GoogleAnalytics gaId="G-7Z28QL2KWG" />
      </body>
    </html>
  );
}