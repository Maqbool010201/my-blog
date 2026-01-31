// src/components/Hero/StaticHero.jsx
import Image from 'next/image';

export default function StaticHero() {
  // q-auto اور f-auto امیج کٹ کو بہترین فارمیٹ چننے دیں گے
  // w-1000 ڈیسک ٹاپ کے لیے کافی ہے، موبائل پر Next.js خود اسے چھوٹا کر دے گا
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-1000,q-auto,f-auto"; 

  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden bg-[#0a192f]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media"
        fill
        priority
        loading="eager" // براؤزر کو فوری لوڈ کرنے پر مجبور کرتا ہے
        fetchPriority="high"
        decoding="sync" // رینڈرنگ ڈیلے ختم کرنے کے لیے
        className="object-cover object-right md:object-center opacity-70"
        sizes="(max-width: 768px) 100vw, 100vw"
      />
      
      {/* Optimized Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-gradient-to-r md:from-white/90 md:to-transparent z-[1]" />
      
      <div className="relative z-10 container mx-auto h-full px-4 flex items-center justify-center md:justify-start">
        <div className="max-w-xl text-center md:text-left pt-4">
          <span className="inline-block mb-1 text-[9px] font-bold tracking-[0.2em] uppercase text-blue-400 md:text-blue-600 bg-black/20 md:bg-transparent px-2 py-0.5 rounded">
            Digital Media Platform
          </span>
          {/* h1 کی ہائٹ فکس رکھیں تاکہ ٹیکسٹ لوڈ ہوتے وقت لے آؤٹ شفٹ نہ ہو */}
          <h1 className="text-xl sm:text-3xl md:text-6xl font-black text-white md:text-slate-900 leading-tight min-h-[1.2em]">
            Insightful Content.<br className="hidden md:block" />
            <span className="text-blue-400 md:text-blue-600"> Curated for Growth.</span>
          </h1>
          <div className="mt-4 md:mt-6">
            <button className="bg-blue-600 text-white px-5 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-base font-bold shadow-lg active:scale-95 transition-transform">
              Read Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}