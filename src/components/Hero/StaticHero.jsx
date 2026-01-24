import Image from "next/image";

export default function StaticHero() {
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-600,q-60,f-auto";

  return (
    /* موبائل پر h-[250px] اور ڈیسک ٹاپ پر h-[500px] */
    <section className="relative w-full h-[250px] md:h-[500px] overflow-hidden bg-[#050c1a]">
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
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-3xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic">
          Wise Mix <span className="text-blue-500">Media</span>
        </h1>
        <p className="text-sm md:text-xl text-gray-300 max-w-2xl font-light">
          Mastering Digital Skills at the Heart of Labor.
        </p>
      </div>

      {/* Tailwind 4.0 fix: use standard linear-gradient if bg-linear-to-t fails */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050c1a] via-transparent to-black/20"></div>
    </section>
  );
}