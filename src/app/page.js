import { Suspense } from "react";
import StaticHero from "@/components/Hero/StaticHero";
import FeaturedPosts from "@/components/FeaturedPosts/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts/LatestPosts";
import Sidebar from "@/components/Sidebar/Sidebar";
import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";
export const revalidate = 3600;
export default async function HomePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const pageNumber = Number(resolvedSearchParams?.page ?? 1);
  const query = String(resolvedSearchParams?.q || "").trim();

  const latestPost = await prisma.post.findFirst({
    where: { siteId: DEFAULT_SITE_ID, published: true },
    orderBy: { createdAt: "desc" },
    select: { slug: true },
  });

  const heroCtaHref = latestPost?.slug ? `/blog/${latestPost.slug}` : "/?page=1";

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <StaticHero ctaHref={heroCtaHref} />

      <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100" />}>
        <FeaturedPosts />
      </Suspense>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
              <LatestPosts page={pageNumber} query={query} />
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
