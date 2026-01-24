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

// یہاں ہم نے verification شامل کی ہے
export const metadata = {
  title: {
    default: 'Wise Mix Media | Insightful Content for Growth',
    template: '%s | Wise Mix Media',
  },
  description: 'Explore expert-written articles across technology, business, and lifestyle.',
  authors: [{ name: 'Maqbool' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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

  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          as="image" 
          href="https://ik.imagekit.io/ag0dicbdub/uploads/hero6.webp?tr=w-750" 
          fetchPriority="high"
        />
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