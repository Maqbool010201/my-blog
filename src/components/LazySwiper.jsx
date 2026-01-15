// components/LazySwiper.jsx
"use client";
import { useEffect, useState } from 'react';

const LazySwiper = ({ children, ...props }) => {
  const [SwiperComponent, setSwiperComponent] = useState(null);
  const [SwiperSlideComponent, setSwiperSlideComponent] = useState(null);

  useEffect(() => {
    const loadSwiper = async () => {
      const { Swiper, SwiperSlide } = await import('swiper/react');
      await import('swiper/css');
      await import('swiper/css/navigation');
      await import('swiper/css/pagination');
      
      setSwiperComponent(() => Swiper);
      setSwiperSlideComponent(() => SwiperSlide);
    };

    loadSwiper();
  }, []);

  if (!SwiperComponent || !SwiperSlideComponent) {
    return <div className="w-full h-[350px] md:h-[480px] bg-gray-200 animate-pulse rounded-xl"></div>;
  }

  return (
    <SwiperComponent {...props}>
      {children(SwiperSlideComponent)}
    </SwiperComponent>
  );
};

export default LazySwiper;