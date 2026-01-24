import Image from "next/image";

export default function StaticHero() {
  // LCP FIX: امیج کا سائز مزید کم کریں (w-600) اور کوالٹی 70 کریں
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-600,q-70,f-auto";

  return (
    <section className="relative w-full h-[350px] md:h-[500px] overflow-hidden bg-[#0a192f]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero"
        fill
        priority
        fetchPriority="high" // یہ براؤزر کو بتاتا ہے کہ اسے سب سے پہلے ڈاؤن لوڈ کرو
        loading="eager"      // لوزی لوڈنگ ختم کریں
        className="object-cover object-center opacity-70"
        sizes="100vw"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">
          Wise Mix Media
        </h1>
        <p className="text-gray-100 text-lg md:text-xl font-medium drop-shadow-md">
          Empowering workers with digital skills.
        </p>
      </div>
      <div className="absolute inset-0 bg-black/40 z-10"></div>
    </section>
  );
}