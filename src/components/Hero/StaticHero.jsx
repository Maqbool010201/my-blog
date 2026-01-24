import Image from "next/image";

export default function StaticHero() {
  // ImageKit optimization: auto-format and optimized width
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-800,q-80,f-auto";

  return (
    <section className="relative w-full aspect-[16/9] md:aspect-[21/7] overflow-hidden bg-[#0a192f]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero"
        fill
        priority
        fetchPriority="high"
        className="object-cover object-center opacity-70"
        sizes="100vw"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-3xl md:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-xl">
          Wise Mix Media
        </h1>
        <p className="text-gray-200 text-sm md:text-xl max-w-2xl font-medium drop-shadow-md">
          Empowering workers with digital skills.
        </p>
      </div>

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a192f]/60"></div>
    </section>
  );
}