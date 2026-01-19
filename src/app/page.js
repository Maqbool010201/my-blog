import { Suspense } from "react";
import StaticHero from "@/components/Hero/StaticHero";
import FeaturedPosts from "@/components/FeaturedPosts/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts/LatestPosts";
import Sidebar from "@/components/Sidebar/Sidebar";
import Advertisement from "@/components/Advertisement/Advertisement";

export default async function HomePage(props) {
  // 1. سب سے پہلے پروپس کو ہینڈل کریں (نیکسٹ جے ایس 15/16 کے لیے ضروری)
  const resolvedParams = await (props?.searchParams || {});
  const pageNumber = resolvedParams.page ? Number(resolvedParams.page) : 1;

  // 2. یو آر ایل کنفیگریشن
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.wisemixmedia.com";
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  let adsByPosition = {};

  try {
    // 3. ایڈز فیچ کرنا
    const res = await fetch(
      `${baseUrl}/api/advertisements?pageType=home&isActive=true`,
      { 
        cache: "no-store",
        next: { revalidate: 0 } 
      }
    );

    if (res.ok) {
      const ads = await res.json();
      if (Array.isArray(ads)) {
        ads.forEach((ad) => {
          adsByPosition[ad.position] = ad;
        });
      }
    }
  } catch (err) {
    console.log("Ads fetch failed, moving on...");
  }

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <StaticHero />

      {adsByPosition["content-top"] && (
        <div className="container mx-auto px-4 mt-2">
          <Advertisement adData={adsByPosition["content-top"]} />
        </div>
      )}

      <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse" />}>
        <FeaturedPosts />
      </Suspense>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          <div className="lg:col-span-3">
            {/* 4. پیج نمبر یہاں پاس کریں */}
            <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
              <LatestPosts page={pageNumber} />
            </Suspense>
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
  );
}