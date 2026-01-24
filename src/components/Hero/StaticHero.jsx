import Image from "next/image";

export default function StaticHero() {
  // ImageKit URL with mobile-specific width (600px) and auto format
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-800,q-75,f-auto";

  return (
    <section className="relative w-full h-[40vh] md:h-[65vh] overflow-hidden bg-[#0a192f]">
      {/* Background Image Optimization */}
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero"
        fill
        priority // Required for LCP
        fetchPriority="high" // Tells browser this is the most important image
        className="object-cover object-right md:object-center opacity-60"
        sizes="(max-width: 768px) 100vw, 1200px"
      />

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-3xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
          Wise Mix Media
        </h1>
        <p className="text-gray-200 text-sm md:text-xl max-w-2xl font-medium drop-shadow-md">
          Empowering workers and laborers with digital skills for the future.
        </p>
        
        <div className="mt-8 flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0a192f]/80"></div>
    </section>
  );
}