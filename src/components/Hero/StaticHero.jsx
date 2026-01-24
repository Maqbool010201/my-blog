import Image from "next/image";

export default function StaticHero() {
  // LCP FIX: وہی لنک جو ہم نے layout.js میں preload کیا ہے
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-600,q-60,f-auto";

  return (
    /* موبائل پر h-[250px] (پہلے 450 تھا) اور ڈیسک ٹاپ پر h-[500px] */
    <section className="relative w-full h-62.5 md:h-125 overflow-hidden bg-[#050c1a]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero"
        fill
        priority={true}
        fetchPriority="high"
        loading="eager"
        className="object-cover object-center opacity-60"
        sizes="100vw"
      />
      
      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-3xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic">
          Wise Mix <span className="text-blue-500">Media</span>
        </h1>
        <p className="text-sm md:text-xl text-gray-300 max-w-2xl font-light">
          Mastering Digital Skills at the Heart of Labor.
        </p>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-[#050c1a] via-transparent to-black/20"></div>
    </section>
  );
}