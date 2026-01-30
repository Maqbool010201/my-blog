import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import Footer from '@/components/Footer/Footer';
import Menu from '@/components/Header/Menu/Menu';
import { GoogleAnalytics } from '@next/third-parties/google';

export const revalidate = 3600; // اب یہ ایک گھنٹے تک کیشے رہے گا

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="https://ik.imagekit.io/ag0dicbdub/uploads/hero6.webp?tr=w-750" fetchPriority="high" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          {/* ہم نے یہاں سے categories ہٹا دیا ہے کیونکہ مینیو خود نکالے گا */}
          <Menu /> 
          <main className="grow w-full">{children}</main>
          <Footer />
        </Providers>
        <GoogleAnalytics gaId="G-7Z28QL2KWG" />
      </body>
    </html>
  );
}