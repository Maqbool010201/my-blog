import Image from 'next/image';

export default function StaticHero() {
  // ImageKit URL with auto-format and optimization parameters
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-800,q-70,f-auto"; 

  return (
    <section className="relative w-full h-[35vh] md:h-[60vh] overflow-hidden bg-[#0a192f]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media"
        fill
        priority // سب سے پہلے لوڈ کرنے کے لیے
        fetchPriority="high"
        decoding="sync"
        className="object-cover object-right md:object-center opacity-70"
        // یہ لائن گوگل سپیڈ کے لیے بہت اہم ہے
        sizes="(max-width: 768px) 100vw, 1200px" 
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-white/90 md:to-transparent z-[1]" />

      <div className="relative z-10 container mx-auto h-full px-4 flex items-center justify-center md:justify-start">
        <div className="max-w-xl text-center md:text-left pt-4">
          <span className="inline-block mb-1 text-[9px] font-bold tracking-[0.2em] uppercase text-blue-400 md:text-blue-600 bg-black/20 md:bg-transparent px-2 py-0.5 rounded">
            Digital Media Platform
          </span>

          <h1 className="text-xl sm:text-3xl md:text-6xl font-black text-white md:text-slate-900 leading-tight drop-shadow-md md:drop-shadow-none">
            Insightful Content.<br className="hidden md:block" />
            <span className="text-blue-400 md:text-blue-600"> Curated for Growth.</span>
          </h1>

          <div className="mt-4 md:mt-6">
            <button className="bg-blue-600 text-white px-5 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-base font-bold transition-all shadow-lg active:scale-95">
              Read Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}