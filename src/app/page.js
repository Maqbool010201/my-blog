import { Suspense } from "react";
import StaticHero from "@/components/Hero/StaticHero";
import FeaturedPosts from "@/components/FeaturedPosts/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts/LatestPosts";
import Sidebar from "@/components/Sidebar/Sidebar";
import Advertisement from "@/components/Advertisement/Advertisement";

export default async function HomePage(props) {
  // فکس: searchParams کو محفوظ طریقے سے نکالنا
  const searchParams = await props?.searchParams;
  const pageNumber = searchParams?.page ? Number(searchParams.page) : 1;

  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.wisemixmedia.com";
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  let adsByPosition = {};
  try {
    const res = await fetch(
      `${baseUrl}/api/advertisements?pageType=home&isActive=true`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const ads = await res.json();
      ads.forEach((ad) => {
        adsByPosition[ad.position] = ad;
      });
    }
  } catch (err) {
    console.error("Ad fetch error ignored");
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

      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <div className="lg:col-span-3">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
            <LatestPosts page={pageNumber} />
          </Suspense>
        </div>
        <aside className="lg:col-span-1">
          <Sidebar />
        </aside>
      </section>
    </div>
  );
}