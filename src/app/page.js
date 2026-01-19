import { Suspense } from "react";
import StaticHero from "@/components/Hero/StaticHero";
import FeaturedPosts from "@/components/FeaturedPosts/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts/LatestPosts";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function HomePage({ searchParams }) {
  // ✅ Safe page parsing (NO crash)
  const pageNumber = Number(searchParams?.page) || 1;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <StaticHero />

      {/* FEATURED POSTS */}
      <Suspense
        fallback={<div className="h-80 bg-gray-50 animate-pulse rounded-lg mx-4 mt-8" />}
      >
        <FeaturedPosts />
      </Suspense>

      {/* MAIN CONTENT */}
      <section className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LATEST POSTS */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={<div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}
            >
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
