import Image from "next/image";

export default function StaticHero() {
  // موبائل کے لیے صرف 600px کی امیج مانگیں تاکہ LCP تیز ہو
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-600,q-80,f-auto";

  return (
    // h-[40vh] فکس ہائٹ دے دی ہے تاکہ براؤزر کو پتا ہو کتنی جگہ چھوڑنی ہے
    <section className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden bg-[#0a192f]">
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
        <p className="text-gray-200 text-sm md:text-xl max-w-2xl font-medium">
          Empowering workers with digital skills.
        </p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a192f]/60"></div>
    </section>
  );
}