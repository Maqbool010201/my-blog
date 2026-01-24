import Image from "next/image";

export default function StaticHero() {
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-600,q-60,f-auto";

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#050c1a]" 
      style={{ height: '250px' }} // موبائل ہائٹ فکسڈ
    >
      {/* Desktop adjustment using a wrapper with different height */}
      <div className="absolute inset-0 md:hidden">
         <Image src={heroImageUrl} alt="Hero" fill priority fetchPriority="high" className="object-cover opacity-60" sizes="100vw" />
      </div>
      <div className="hidden md:block absolute inset-0" style={{ height: '500px' }}>
         <Image src={heroImageUrl} alt="Hero" fill priority fetchPriority="high" className="object-cover opacity-60" sizes="100vw" />
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-3xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic">
          Wise Mix <span className="text-blue-500">Media</span>
        </h1>
        <p className="text-sm md:text-xl text-gray-300 max-w-2xl font-light">
          Mastering Digital Skills at the Heart of Labor.
        </p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050c1a] via-transparent to-black/20"></div>
    </section>
  );
}