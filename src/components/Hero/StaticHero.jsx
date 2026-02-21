import Image from "next/image";
import Link from "next/link";

export default function StaticHero({ ctaHref = "/?page=1" }) {
  return (
    <section className="relative w-full h-[42vh] md:h-[62vh] overflow-hidden bg-slate-950 md:bg-[#0a192f]">
      <div className="hidden md:block" aria-hidden="true">
        <Image
          alt="Wise Mix Media"
          src="/hero6.png"
          fill
          sizes="(min-width: 768px) 100vw, 0px"
          className="object-cover opacity-70"
        />
      </div>

      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-white/90 via-white/65 to-transparent z-[1]" />

      <div className="relative z-10 container mx-auto h-full px-4 flex items-center justify-center md:justify-start">
        <div className="max-w-xl text-center md:text-left pt-4">
          <span className="inline-block mb-1 text-[9px] font-bold tracking-[0.2em] uppercase text-blue-400 md:text-blue-600 px-2 py-0.5 rounded">
            Digital Media Platform
          </span>
          <h1 className="text-xl sm:text-3xl md:text-6xl font-black text-white md:text-slate-900 leading-tight min-h-[1.2em]">
            Insightful Content.<br className="hidden md:block" />
            <span className="text-blue-400 md:text-blue-600"> Curated for Growth.</span>
          </h1>
          <div className="mt-4 md:mt-6">
            <Link href={ctaHref} className="inline-block bg-blue-600 text-white px-5 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-base font-bold shadow-lg active:scale-95 transition-transform hover:bg-blue-700">
              Read Articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
