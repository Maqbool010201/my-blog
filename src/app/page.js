import { Suspense } from 'react';
import StaticHero from '@/components/Hero/StaticHero';
import FeaturedPosts from '@/components/FeaturedPosts/FeaturedPosts';
import LatestPosts from '@/components/LatestPosts/LatestPosts';
import Sidebar from '@/components/Sidebar/Sidebar';
import Advertisement from '@/components/Advertisement/Advertisement';

export default async function HomePage(props) {
  // Next.js 15 کے لیے سب سے محفوظ طریقہ
  const searchParams = props?.searchParams ? await props.searchParams : {};
  
  // یہاں چیک کریں: اگر page موجود نہیں تو 1 ورنہ اس کی ویلیو
  const pageNumber = searchParams?.page ? parseInt(searchParams.page, 10) : 1;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.wisemixmedia.com';

  return (
    <div className="min-h-screen bg-gray-50">
      <StaticHero />

      {/* Featured Posts سیکشن */}
      <Suspense fallback={<div className="h-60 bg-gray-100 animate-pulse" />}>
        <FeaturedPosts />
      </Suspense>

      <section className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Latest Posts میں محفوظ طریقے سے پیج نمبر بھیجیں */}
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