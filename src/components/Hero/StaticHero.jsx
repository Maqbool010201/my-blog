import Image from 'next/image';

export default function StaticHero() {
  // ImageKit کا مکمل پاتھ یا صرف فائل نیم (اگر لوڈر کنفیگر ہے)
  const heroImageUrl = "hero6.png"; 

  return (
    <section className="relative w-full h-[40vh] sm:h-125 lg:h-162.5 overflow-hidden bg-[#0a192f]">
      
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero Background"
        fill 
        priority 
        fetchPriority="high"
        className="object-cover object-right md:object-center opacity-90"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 md:bg-gradient-to-r md:from-white/95 md:via-white/70 md:to-transparent z-1" />

      <div className="relative z-10 container mx-auto h-full px-6 flex items-center justify-center md:justify-start">
        <div className="max-w-4xl text-center md:text-left">
          
          <span className="hidden md:inline-block mb-3 text-sm font-bold tracking-[0.2em] uppercase text-blue-600">
            Trusted Digital Media Platform
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-white md:text-slate-900 drop-shadow-md md:drop-shadow-none">
            Insightful Content.<br className="hidden md:block" />
            <span className="text-blue-400 md:text-blue-600"> Curated for Growth.</span>
          </h1>

          <p className="hidden md:block mt-6 text-base md:text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
            Explore expert-written articles across technology, business, and lifestyle. 
            Wise Mix Media delivers clarity, depth, and value.
          </p>

          <div className="mt-6 md:mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm md:text-base font-bold transition-all shadow-lg hover:shadow-blue-500/50 transform hover:scale-105">
              Read Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}