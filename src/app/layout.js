import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import Footer from "@/components/Footer/Footer";
import Menu from "@/components/Header/Menu/Menu";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const siteSettingDelegate = prisma?.siteSetting;

async function getSiteSettings() {
  try {
    if (!siteSettingDelegate) return null;
    return await siteSettingDelegate.findUnique({
      where: { siteId: DEFAULT_SITE_ID },
      select: {
        googleSiteVerification: true,
        googleAdsenseClientId: true,
        googleAnalyticsId: true,
      },
    });
  } catch (error) {
    console.error("Layout settings fetch error:", error);
    return null;
  }
}

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Wisemix Media | Tech Insights & Digital Skills",
      template: "%s | Wisemix Media",
    },
    description: "Expert-led blog on Next.js, Prisma, and career growth by Maqbool Hussain.",
    robots: "index, follow",
    alternates: { canonical: siteUrl },
    authors: [{ name: "Maqbool Hussain" }],
    verification: settings?.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();
  const gaId = settings?.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || "";
  const adsenseClient = settings?.googleAdsenseClientId?.trim();

  return (
    <html lang="en">
      <head>
        {adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
              adsenseClient
            )}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Suspense fallback={<div className="h-16 w-full bg-[#0b1221]" />}>
            <Menu />
          </Suspense>

          <main className="flex-grow w-full">{children}</main>

          <Suspense fallback={<div className="h-64 w-full bg-[#0b1221]" />}>
            <Footer />
          </Suspense>
        </Providers>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
