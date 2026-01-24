import Image from 'next/image';

export default function StaticHero() {
  // ImageKit کو کہیں کہ کوالٹی 70 کرے اور فارمیٹ آٹو رکھے
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=q-70,f-auto"; 

  return (
    <section className="relative w-full h-[35vh] md:h-[60vh] overflow-hidden bg-[#0a192f]">
      <Image
        src={heroImageUrl}
        alt="Wise Mix Media"
        fill
        priority // لازمی ہے
        fetchPriority="high"
        className="object-cover object-right md:object-center opacity-70"
        // یہ لائن موبائل پر اسکور 90+ کرے گی
        // اگر موبائل ہے (max-width: 768px) تو صرف 600px چوڑی تصویر لوڈ کرو
        sizes="(max-width: 768px) 600px, 1200px" 
      />
      {/* باقی اوورلے اور ٹیکسٹ کوڈ */}
    </section>
  );
}