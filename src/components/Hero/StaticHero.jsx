// src/components/Hero/StaticHero.jsx
import Image from 'next/image';

export default function StaticHero() {
  // f-auto اور q-auto بہترین اسپیڈ کے لیے
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-1200,q-auto,f-auto"; 

  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden bg-[#0a192f]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media"
        fill
        priority // LCP کے لیے لازمی
        fetchPriority="high" // براؤزر کو بتاتا ہے کہ یہ سب سے اہم ہے
        placeholder="blur" // جب تک امیج لوڈ نہ ہو، ہلکا سا رنگ نظر آئے گا
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" 
        className="object-cover object-right md:object-center opacity-70 transition-opacity duration-500"
        sizes="(max-width: 768px) 100vw, 100vw" // موبائل کے لیے الگ سائز انسٹرکشن
        quality={80}
      />
      
      {/* Optimized Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-gradient-to-r md:from-white/90 md:to-transparent z-[1]" />
      
      <div className="relative z-10 container mx-auto h-full px-4 flex items-center justify-center md:justify-start">
        <div className="max-w-xl text-center md:text-left">
          <span className="inline-block mb-2 text-[10px] font-bold tracking-widest uppercase text-blue-400 md:text-blue-600 bg-black/30 md:bg-blue-50 px-2 py-1 rounded">
            Digital Media Platform
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white md:text-slate-900 leading-[1.1]">
            Insightful Content.<br className="hidden md:block" />
            <span className="text-blue-400 md:text-blue-600"> Curated for Growth.</span>
          </h1>
          <div className="mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 md:px-10 md:py-4 rounded-full text-sm md:text-lg font-bold shadow-xl transition-transform active:scale-95">
              Read Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}