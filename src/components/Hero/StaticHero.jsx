import Image from 'next/image';

export default function StaticHero() {
  // ImageKit path (Custom Loader will handle the rest)
  const heroImageUrl = "uploads/hero6.webp"; 

  return (
    <section className="relative w-full h-112.5 sm:h-125 lg:h-162.5 overflow-hidden bg-slate-900">
      
      {/* Background Image using Next.js Optimizer */}
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero Background"
        fill 
        priority // Required for LCP
        fetchPriority="high" // یہ براؤزر کو بتائے گا کہ اسے فوراً ڈاؤن لوڈ کرنا ہے (Lighthouse Fix)
        loading="eager"      // سست روی (Lazy load) کو روکنے کے لیے
        decoding="sync"      // امیج کو فوری رینڈر کرنے کے لیے
        sizes="100vw"
        className="object-cover object-top md:object-center opacity-80"
      />

      {/* Gradient Overlay: Accessibility بہتر کرنے کے لیے ڈارک کنٹراسٹ بڑھا دیا ہے */}
      <div className="absolute inset-0 bg-linear-to-b from-black/85 via-transparent to-black/90 md:bg-linear-to-r md:from-white/95 md:via-white/60 md:to-transparent z-1" />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto h-full px-6 flex items-center justify-center md:justify-start">
        <div className="max-w-4xl text-center md:text-left text-white md:text-slate-900">
          
          <span className="inline-block mb-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-blue-400 md:text-blue-600">
            Trusted Digital Media Platform
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Insightful Content.<br />
            <span className="text-blue-400 md:text-blue-600">Curated for Growth.</span>
          </h1>

          <p className="mt-6 text-base md:text-xl text-slate-200 md:text-slate-600 leading-relaxed max-w-2xl font-medium">
            Explore expert-written articles across technology, business, and lifestyle. 
            Wise Mix Media delivers clarity, depth, and value.
          </p>

          <div className="mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 cursor-pointer">
              Read Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}