import Image from 'next/image';

export default function StaticHero() {
  // Public folder path for the local image
  const localHeroPath = "/hero6.png"; 

  return (
    <section className="relative w-full h-[35vh] sm:h-[500px] lg:h-[650px] overflow-hidden bg-blue-950">
      
      {/* Background Image - Local with Loader Bypass */}
      <Image
        src={localHeroPath}
        alt="Wise Mix Media Hero Background"
        fill 
        priority 
        loader={({ src }) => src} 
        fetchPriority="high"
        loading="eager"      
        decoding="sync"      
        sizes="100vw"
        className="object-cover object-center opacity-90"
      />

      {/* Modern Gradient Overlay: Deep Blue on the left for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-transparent to-blue-950/80 md:bg-gradient-to-r md:from-blue-950/90 md:via-blue-900/40 md:to-transparent z-1" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto h-full px-6 flex items-center justify-center md:justify-start">
        <div className="max-w-4xl text-center md:text-left">
          
          {/* Small Badge - Hidden on small mobile to save space */}
          <span className="hidden sm:inline-block mb-4 text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-blue-300">
            Trusted Digital Media Platform
          </span>

          {/* Main Heading - Responsive text sizes */}
          <h1 className="text-white text-3xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Insightful Content.<br className="hidden md:block" />
            <span className="text-blue-400"> Curated for Growth.</span>
          </h1>

          {/* Subtext - Hidden on mobile to keep 35vh height clean */}
          <p className="hidden md:block mt-6 text-base md:text-xl text-blue-100/90 leading-relaxed max-w-2xl font-medium">
            Explore expert-written articles across technology, business, and lifestyle. 
            Wise Mix Media delivers clarity, depth, and value through specialized content.
          </p>

          {/* Call to Action Button */}
          <div className="mt-6 md:mt-10">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 md:px-10 md:py-4 rounded-full text-sm md:text-lg font-bold shadow-xl shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
              Read Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}