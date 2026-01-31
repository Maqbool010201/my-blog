import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import Footer from '@/components/Footer/Footer';
import Menu from '@/components/Header/Menu/Menu';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Suspense } from 'react';

// Fonts optimization
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
        {/* DNS Preconnect: ImageKit کے کنکشن کو تیز بنانے کے لیے */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        
        {/* Preload Hero Image: یہ LCP کو بہتر کرے گا */}
        <link 
          rel="preload" 
          as="image" 
          href="https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-1000,q-auto,f-auto" 
          fetchPriority="high"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          {/* Suspense: مینو کا ڈیٹا لوڈ ہونے تک یہ پیج کو بلاک نہیں کرے گا */}
          <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100 w-full animate-pulse" />}>
            <Menu />
          </Suspense>

          {/* min-h-[70vh]: یہ CLS کو ختم کرے گا کیونکہ یہ مین مواد کے لیے پہلے سے جگہ محفوظ کر لے گا */}
          <main className="grow w-full min-h-[70vh]">
            {children}
          </main>

          <Footer />
        </Providers>

        {/* Google Analytics: یہ آخر میں لوڈ ہوگا تاکہ اسپیڈ متاثر نہ ہو */}
        <GoogleAnalytics gaId="G-7Z28QL2KWG" />
      </body>
    </html>
  );
}