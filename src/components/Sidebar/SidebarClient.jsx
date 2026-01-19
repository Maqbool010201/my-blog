import { Suspense } from "react";
import StaticHero from "@/components/Hero/StaticHero";
import FeaturedPosts from "@/components/FeaturedPosts/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts/LatestPosts";
import Sidebar from "@/components/Sidebar/Sidebar";
import Advertisement from "@/components/Advertisement/Advertisement";

export default async function HomePage(props) {
  // Next.js 15 کے مطابق searchParams کو handle کرنے کا بہتر طریقہ
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams.page) || 1;

  // یو آر ایل کو محفوظ طریقے سے بنانا
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.wisemixmedia.com";
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  let adsByPosition = {};

  try {
    // ایڈز فیچ کرنے کے لیے ٹائم آؤٹ اور ایرر ہینڈلنگ
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
    console.error("Ad fetch error ignored for stability.");
    adsByPosition = {};
  }

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      {/* HERO SECTION */}
      <StaticHero />

      {/* TOP AD: اگر ایڈ نہیں ہے تو یہ جگہ نہیں گھیرے گا */}
      {adsByPosition["content-top"] && (
        <div className="container mx-auto px-4 mt-2 md:mt-6">
          <Advertisement adData={adsByPosition["content-top"]} />
        </div>
      )}

      {/* FEATURED POSTS */}
      <div className="mt-2 md:mt-0">
        <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100" />}>
          <FeaturedPosts />
        </Suspense>
      </div>

      <section className="container mx-auto px-4">
        {/* MIDDLE AD */}
        {adsByPosition["content-middle"] && (
          <div className="w-full my-4 md:my-8 flex justify-center">
            <Advertisement adData={adsByPosition["content-middle"]} />
          </div>
        )}

        {/* LATEST POSTS + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
              <LatestPosts page={pageNumber} />
            </Suspense>
          </div>
          <div className="lg:col-span-1">
             <Sidebar />
          </div>
        </div>

        {/* BOTTOM AD */}
        {adsByPosition["content-bottom"] && (
          <div className="w-full my-8 flex justify-center">
            <Advertisement adData={adsByPosition["content-bottom"]} />
          </div>
        )}
      </section>
    </div>
  );
}