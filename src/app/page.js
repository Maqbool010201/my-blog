// app/page.js
import { Suspense } from 'react';
import StaticHero from '@/components/Hero/StaticHero';
import FeaturedPosts from '@/components/FeaturedPosts/FeaturedPosts';
import LatestPosts from '@/components/LatestPosts/LatestPosts';
import Sidebar from '@/components/Sidebar/Sidebar';
import Advertisement from '@/components/Advertisement/Advertisement';

export default async function HomePage(props) {
  const searchParams = await props.searchParams;
  // Safely get page number from searchParams
  const pageNumber = parseInt(searchParams?.page || '1', 10);

  // Base URL for API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Fetch advertisements
  let ads = [];
  try {
    const res = await fetch(
      `${baseUrl}/api/advertisements?pageType=home&isActive=true`,
      { cache: 'no-store' }
    );

    if (res.ok) {
      ads = await res.json();
    } else {
      console.warn('Failed to fetch ads:', res.status);
    }
  } catch (err) {
    console.error('Error fetching ads:', err);
  }

  // Organize ads by position
  const adsByPosition = {};
  ads.forEach(ad => {
    if (ad.position) adsByPosition[ad.position] = ad;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <StaticHero />

      {/* Content Top Ad */}
      {adsByPosition['content-top'] && (
        <div className="container mx-auto px-4 mt-6">
          <Advertisement adData={adsByPosition['content-top']} />
        </div>
      )}

      {/* Featured Posts */}
      <Suspense fallback={null}>
        <FeaturedPosts />
      </Suspense>

      <section className="container mx-auto px-4 mt-8">
        {/* Content Middle Ad */}
        {adsByPosition['content-middle'] && (
          <Advertisement
            adData={adsByPosition['content-middle']}
            className="my-8"
          />
        )}

        {/* Latest Posts + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <LatestPosts page={pageNumber} />
          </div>
          <Sidebar />
        </div>

        {/* Content Bottom Ad */}
        {adsByPosition['content-bottom'] && (
          <Advertisement
            adData={adsByPosition['content-bottom']}
            className="my-8"
          />
        )}
      </section>
    </div>
  );
}
