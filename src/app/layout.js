import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import Footer from '@/components/Footer/Footer';
import Menu from '@/components/Header/Menu/Menu';


const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' });


export default async function RootLayout({ children }) {
return (
<html lang="en">
<head>
<link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://ik.imagekit.io" />
</head>
<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
<Providers>
<Menu />
<main className="grow">{children}</main>
<Footer />
</Providers>
</body>
</html>
);
}