import { Suspense } from "react";
import StaticHero from "@/components/Hero/StaticHero";
import FeaturedPosts from "@/components/FeaturedPosts/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts/LatestPosts";
import Sidebar from "@/components/Sidebar/Sidebar";
import Advertisement from "@/components/Advertisement/Advertisement";

export default function HomePage({ searchParams }) {
  // ✅ SAFE: no await
  const pageNumber = Number(searchParams?.page) || 1;

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      {/* HERO */}
      <StaticHero />

      {/* FEATURED POSTS */}
      <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100" />}>
        <FeaturedPosts />
      </Suspense>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* LATEST POSTS */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
              <LatestPosts page={pageNumber} />
            </Suspense>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
