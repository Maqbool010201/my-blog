import Image from 'next/image';

export default function StaticHero() {
  // ImageKit URL
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.webp?tr=w-1400,q-80";

  return (
    <section className="relative w-full h-[450px] sm:h-[500px] lg:h-[650px] overflow-hidden bg-slate-900">
      
      {/* Background Image using Next.js Optimizer */}
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero Background"
        fill // Ye absolute inset-0 ka kaam karega
        priority // Ye fetchPriority="high" ka kaam karega aur LCP behtar karega
        sizes="100vw"
        className="object-cover object-top md:object-center opacity-80"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 md:bg-gradient-to-r md:from-white/95 md:via-white/60 md:to-transparent z-[1]" />

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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
              Read Articles
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}