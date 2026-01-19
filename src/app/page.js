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

      {/* TOP AD - موبائل پر مارجن کم (mt-2) اور اگر ایڈ نہیں ہے تو ہائٹ زیرو */}
      {adsByPosition["content-top"] && (
        <div className="container mx-auto px-4 mt-2 md:mt-6 min-h-[50px] md:min-h-[120px]">
           <Advertisement adData={adsByPosition["content-top"]} />
        </div>
      )}

      {/* FEATURED POSTS - موبائل پر پیڈنگ سیٹ کی */}
      <div className="mt-4 md:mt-0">
        <Suspense fallback={<div className="min-h-[200px]"></div>}>
          <FeaturedPosts />
        </Suspense>
      </div>

      <section className="container mx-auto px-4">
        {/* MIDDLE AD - یہاں بھی کنڈیشن لگا دی تاکہ خالی جگہ نہ رہے */}
        {adsByPosition["content-middle"] && (
          <div className="w-full min-h-[50px] md:min-h-[120px] my-4 md:my-8 flex justify-center">
            <Advertisement adData={adsByPosition["content-middle"]} />
          </div>
        )}

        {/* LATEST POSTS + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <LatestPosts page={pageNumber} />
          </div>
          <Sidebar />
        </div>

        {/* BOTTOM AD */}
        {adsByPosition["content-bottom"] && (
          <div className="w-full min-h-[50px] md:min-h-[120px] my-4 md:my-8 flex justify-center">
            <Advertisement adData={adsByPosition["content-bottom"]} />
          </div>
        )}
      </section>
    </div>
  );
}