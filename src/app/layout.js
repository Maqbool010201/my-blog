import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import Footer from '@/components/Footer/Footer';
import Menu from '@/components/Header/Menu/Menu';

export const dynamic = 'force-dynamic';

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

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/api/categories`, { 
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Category fetch error:", error);
    return [];
  }
}

export default async function RootLayout({ children }) {
  const categories = await getCategories();
  const lcpImage = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-600,q-60,f-auto";

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="preload" as="image" href={lcpImage} fetchPriority="high" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Menu categories={categories} />
          <main className="grow w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}