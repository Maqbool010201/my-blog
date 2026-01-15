// app/page.js
import { Suspense } from "react";
import StaticHero from "@/components/Hero/StaticHero";
import FeaturedPosts from "@/components/FeaturedPosts/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts/LatestPosts";
import Sidebar from "@/components/Sidebar/Sidebar";
import Advertisement from "@/components/Advertisement/Advertisement";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const pageNumber = Number(params.page) || 1;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  let adsByPosition = {};
  try {
    const res = await fetch(
      `${baseUrl}/api/advertisements?pageType=home&isActive=true`,
      { cache: "no-store" }
    );
    const ads = await res.json();
    ads.forEach((ad) => {
      adsByPosition[ad.position] = ad;
    });
  } catch (err) {
    console.error("HomePage Ad Fetch Error:", err);
  }

  return (
    <div className="bg-gray-50">
      {/* HERO */}
      <StaticHero />

      {/* TOP AD */}
      <div className="container mx-auto px-4 mt-6 min-h-[120px]">
        {adsByPosition["content-top"] ? (
          <Advertisement adData={adsByPosition["content-top"]} />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      {/* FEATURED POSTS */}
      <Suspense fallback={<div className="min-h-[300px]"></div>}>
        <FeaturedPosts />
      </Suspense>

      <section className="container mx-auto px-4">
        {/* MIDDLE AD */}
        <div className="w-full min-h-[120px] my-8 flex justify-center">
          {adsByPosition["content-middle"] ? (
            <Advertisement adData={adsByPosition["content-middle"]} />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>

        {/* LATEST POSTS + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <LatestPosts page={pageNumber} />
          </div>
          <Sidebar />
        </div>

        {/* BOTTOM AD */}
        <div className="w-full min-h-[120px] my-8 flex justify-center">
          {adsByPosition["content-bottom"] ? (
            <Advertisement adData={adsByPosition["content-bottom"]} />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
      </section>
    </div>
  );
}
