import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import Footer from '@/components/Footer/Footer';
import Menu from '@/components/Header/Menu/Menu';

// فونٹس کو بہتر طریقے سے لوڈ کرنا
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

// --- SEO اور برانڈنگ کے لیے پروفیشنل میٹا ڈیٹا ---
export const metadata = {
  title: {
    default: 'Wise Mix Media | Insightful Content for Growth',
    template: '%s | Wise Mix Media',
  },
  description: 'Explore expert-written articles across technology, business, and lifestyle. Wise Mix Media delivers clarity, depth, and value.',
  keywords: ['Technology Blog', 'Business Insights', 'Lifestyle Articles', 'Wise Mix Media'],
  authors: [{ name: 'Maqbool' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  // سوشل میڈیا پر شیئرنگ کے لیے (OpenGraph)
  openGraph: {
    title: 'Wise Mix Media',
    description: 'Curated insights for growth.',
    type: 'website',
  },
};

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    // کیٹیگریز فیچ کرنے میں ٹائم آؤٹ اور ایرر ہینڈلنگ
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          {/* مینو میں کیٹیگریز پاس ہو رہی ہیں */}
          <Menu categories={categories} />
          
          {/* مین کنٹینٹ */}
          <main className="flex-grow w-full">
            {children}
          </main>
          
          <Footer />
        </Providers>
      </body>
    </html>
  );
}