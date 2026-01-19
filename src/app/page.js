import { Suspense } from 'react';
import StaticHero from '@/components/Hero/StaticHero';
import FeaturedPosts from '@/components/FeaturedPosts/FeaturedPosts';
import LatestPosts from '@/components/LatestPosts/LatestPosts';
import Sidebar from '@/components/Sidebar/Sidebar';
import Advertisement from '@/components/Advertisement/Advertisement';

export default async function HomePage(props) {
  // 1. Next.js 15 کے لیے انتہائی محفوظ طریقہ
  const searchParams = props?.searchParams ? await props.searchParams : {};
  
  // 2. محفوظ طریقے سے پیج نمبر نکالنا
  const page = searchParams?.page;
  const pageNumber = page ? parseInt(page, 10) : 1;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.wisemixmedia.com';

  return (
    <div className="min-h-screen bg-white">
      {/* ہیرو سیکشن - جو آپ نے موبائل کے لیے فکس کیا ہے */}
      <StaticHero />

      <section className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* 3. یہاں سسپنس کے ساتھ ڈیٹا لوڈ ہوگا */}
            <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}>
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