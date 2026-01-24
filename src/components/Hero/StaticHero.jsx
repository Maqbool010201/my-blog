import Image from 'next/image';


export default function StaticHero() {
const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.png?tr=w-1200,q-70,f-auto";


return (
<section className="relative w-full h-[280px] md:h-[500px] overflow-hidden bg-[#0a192f]">
<Image
src={heroImageUrl}
alt="Wise Mix Media"
fill
priority
sizes="100vw"
className="object-cover opacity-70"
/>


<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[1]" />


<div className="relative z-10 container mx-auto h-full px-4 flex items-center justify-center md:justify-start">
<div className="max-w-xl text-center md:text-left">
<span className="inline-block mb-2 text-[10px] font-bold tracking-widest uppercase text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
Digital Media Platform
</span>


<h1 className="text-2xl md:text-6xl font-black text-white leading-tight">
Insightful Content.<br className="hidden md:block" />
<span className="text-blue-400"> Curated for Growth.</span>
</h1>


<div className="mt-4 md:mt-6">
<button className="bg-blue-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-sm font-bold shadow-lg">
Read Articles
</button>
</div>
</div>
</div>
</section>
);
}