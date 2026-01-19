import { Suspense } from 'react';
import StaticHero from '@/components/Hero/StaticHero';
import FeaturedPosts from '@/components/FeaturedPosts/FeaturedPosts';
import LatestPosts from '@/components/LatestPosts/LatestPosts';
import Sidebar from '@/components/Sidebar/Sidebar';
import Advertisement from '@/components/Advertisement/Advertisement';

export default async function HomePage(props) {
  // 1. سب سے اہم فکس: props کو پہلے چیک کریں پھر await کریں
  const searchParams = props?.searchParams ? await props.searchParams : {};
  const pageNumber = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  // 2. Base URL (Vercel کے لیے مکمل ایڈریس)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.wisemixmedia.com';

  let adsByPosition = {};
  try {
    const res = await fetch(
      `${baseUrl}/api/advertisements?pageType=home&isActive=true`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      const ads = await res.json();
      ads.forEach(ad => {
        if (ad.position) adsByPosition[ad.position] = ad;
      });
    }
  } catch (err) {
    console.log('Ads fetch bypass');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaticHero />

      {adsByPosition['content-top'] && (
        <div className="container mx-auto px-4 mt-6">
          <Advertisement adData={adsByPosition['content-top']} />
        </div>
      )}

      {/* Featured Posts سیکشن */}
      <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse" />}>
        <FeaturedPosts />
      </Suspense>

      <section className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Latest Posts میں پیج نمبر پاس کریں اور سسپنس لگائیں */}
            <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse" />}>
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