import Image from "next/image";

export default function StaticHero() {
  // Mobile کے لیے چھوٹی اور تیز لوڈ ہونے والی امیج (Width 640px)
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-640,q-80,f-auto";

  return (
    // موبائل پر ہائٹ کم کر کے 30vh کر دی ہے تاکہ LCP جلدی لوڈ ہو
    <section className="relative w-full h-[30vh] md:h-[60vh] overflow-hidden bg-[#0a192f]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero"
        fill
        priority
        fetchPriority="high"
        className="object-cover object-center opacity-60"
        // Browser کو بتانا کہ موبائل پر یہ پوری اسکرین کی چوڑائی لے گی
        sizes="(max-width: 768px) 100vw, 1200px"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        {/* موبائل پر ٹیکسٹ سائز تھوڑا چھوٹا کیا ہے تاکہ امیج کے اوپر فٹ آئے */}
        <h1 className="text-2xl md:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
          Wise Mix Media
        </h1>
        <p className="text-gray-200 text-xs md:text-xl max-w-2xl font-medium drop-shadow-md">
          Empowering workers with digital skills.
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a192f]/70"></div>
    </section>
  );
}