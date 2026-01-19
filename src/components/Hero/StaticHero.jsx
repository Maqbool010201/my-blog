import Image from 'next/image';

export default function StaticHero() {
  const heroImageUrl = "uploads/hero6.png"; 

  return (
    // UPDATED: Added h-[35vh] for mobile (roughly one-third) and kept your larger heights for desktop
    <section className="relative w-full h-[35vh] sm:h-125 lg:h-162.5 overflow-hidden bg-slate-900">
      
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero Background"
        fill 
        priority 
        fetchPriority="high"
        loading="eager"      
        decoding="sync"      
        sizes="100vw"
        className="object-cover object-top md:object-center opacity-80"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/85 via-transparent to-black/90 md:bg-linear-to-r md:from-white/95 md:via-white/60 md:to-transparent z-1" />

      <div className="relative z-10 container mx-auto h-full px-6 flex items-center justify-center md:justify-start">
        <div className="max-w-4xl text-center md:text-left text-white md:text-slate-900">
          
          {/* UPDATED: Hidden on mobile to save vertical space */}
          <span className="hidden md:inline-block mb-3 text-sm font-bold tracking-[0.2em] uppercase text-blue-600">
            Trusted Digital Media Platform
          </span>

          {/* UPDATED: Reduced text size on mobile (text-2xl) so it doesn't crowd the 33vh height */}
          <h1 className="text-2xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Insightful Content.<br className="hidden md:block" />
            <span className="text-blue-400 md:text-blue-600"> Curated for Growth.</span>
          </h1>

          {/* UPDATED: Hidden on mobile (hidden md:block) as per recommendation */}
          <p className="hidden md:block mt-6 text-base md:text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
            Explore expert-written articles across technology, business, and lifestyle. 
            Wise Mix Media delivers clarity, depth, and value.
          </p>

          {/* UPDATED: Scaled down button slightly for mobile */}
          <div className="mt-4 md:mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base font-bold transition-all transform hover:scale-105 cursor-pointer">
              Read Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}