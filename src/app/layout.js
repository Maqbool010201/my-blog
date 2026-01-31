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
  metadataBase: new URL('https://www.wisemixmedia.com'),
  title: {
    default: 'Wisemix Media | Tech Insights & Digital Skills',
    template: '%s | Wisemix Media',
  },
  description: 'Expert-led blog on Next.js, Prisma, and career growth by Maqbool Hussain.',
  viewport: 'width=device-width, initial-scale=1', // موبائل ویو پورٹ فکس
  robots: 'index, follow',
  alternates: { canonical: 'https://www.wisemixmedia.com' },
  authors: [{ name: 'Maqbool Hussain' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* موبائل پر تھرڈ پارٹی کنکشن تیز کرنے کے لیے */}
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Suspense fallback={<div className="h-16 w-full bg-[#0b1221]" />}>
            <Menu />
          </Suspense>

          <main className="flex-grow w-full">
            {children}
          </main>

          <Suspense fallback={<div className="h-64 w-full bg-[#0b1221]" />}>
            <Footer />
          </Suspense>
        </Providers>
        <GoogleAnalytics gaId="G-7Z28QL2KWG" />
      </body>
    </html>
  );
}