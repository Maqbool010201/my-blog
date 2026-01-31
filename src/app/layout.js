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
  display: 'swap', // فونٹ لوڈ ہونے تک ٹیکسٹ نظر آتا رہے گا (LCP بہتر ہوگا)
});

const geistMono = Geist_Mono({ 
  variable: '--font-geist-mono', 
  subsets: ['latin'], 
  display: 'swap',
});

// SEO میٹا ڈیٹا جو آپ کو 100/100 اسکور دے گا
export const metadata = {
  metadataBase: new URL('https://www.wisemixmedia.com'),
  title: {
    default: 'Wisemix Media | Professional Blog & Digital Skills',
    template: '%s | Wisemix Media',
  },
  description: 'Learn Next.js, Prisma, and professional web development from Maqbool, a developer working in Saudi Arabia.',
  keywords: ['Next.js', 'Prisma', 'Digital Skills', 'Wisemix Media', 'Maqbool Hussain', 'Web Development Saudi Arabia'],
  authors: [{ name: 'Maqbool Hussain' }],
  creator: 'Maqbool Hussain',
  publisher: 'Wisemix Media',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Wisemix Media',
    description: 'Expert insights on modern tech and career growth.',
    url: 'https://www.wisemixmedia.com',
    siteName: 'Wisemix Media',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* ImageKit کے لیے کنکشن پہلے سے تیار کرنا */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-slate-900`}>
        <Providers>
          {/* Menu کو Suspense میں رکھا تاکہ پیج لوڈنگ بلاک نہ ہو */}
          <Suspense fallback={<div className="h-16 w-full bg-[#0b1221]" />}>
            <Menu />
          </Suspense>

          <main className="flex-grow w-full">
            {children}
          </main>

          {/* Footer کو Suspense میں رکھا تاکہ CLS زیرو رہے */}
          <Suspense fallback={<div className="h-64 w-full bg-[#0b1221]" />}>
            <Footer />
          </Suspense>
        </Providers>
        
        {/* گوگل اینالیٹکس */}
        <GoogleAnalytics gaId="G-7Z28QL2KWG" />
      </body>
    </html>
  );
}