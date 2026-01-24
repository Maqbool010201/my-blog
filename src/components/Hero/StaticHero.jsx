import Image from "next/image";

export default function StaticHero() {
  // LCP FIX: امیج کا سائز صرف 600 رکھیں اور کوالٹی 60 تاکہ فوراً لوڈ ہو
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-600,q-60,f-auto";

  return (
    // CLS FIX: h-[450px] فکسڈ ہائٹ
    <section className="relative w-full h-[450px] md:h-[600px] overflow-hidden bg-[#050c1a]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media Hero"
        fill
        priority={true}        // سب سے پہلی ترجیح
        fetchPriority="high"  // براؤزر کو فوراً ڈاؤن لوڈ کرنے کا حکم
        loading="eager"       // لوزی لوڈنگ کا خاتمہ
        className="object-cover object-center opacity-60"
        sizes="100vw"
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter uppercase italic">
          Wise Mix <span className="text-blue-500">Media</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-2xl max-w-2xl font-light">
          Mastering Digital Skills at the Heart of Labor.
        </p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050c1a] via-transparent to-black/20"></div>
    </section>
  );
}