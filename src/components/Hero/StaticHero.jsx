export default function StaticHero() {
  // ImageKit کا یو آر ایل پیرامیٹرز کے ساتھ تاکہ سائز چھوٹا رہے
  const heroImageUrl = "https://ik.imagekit.io/ag0dicbdub/uploads/hero6.webp?tr=w-1400,q-80";

  return (
    <section className="relative w-full h-[450px] sm:h-[500px] lg:h-[650px] overflow-hidden bg-slate-900">
      
      {/* Background Image */}
      <img
        src={heroImageUrl}
        alt="Wise Mix Media Hero Background"
        // React میں P بڑا ہوتا ہے: fetchPriority
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-top md:object-center opacity-80"
      />

      {/* Gradient Overlay: موبائل پر نیچے سے ڈارک تاکہ ٹیکسٹ نظر آئے */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 md:bg-gradient-to-r md:from-white/95 md:via-white/60 md:to-transparent z-[1]" />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto h-full px-6 flex items-center justify-center md:justify-start">
        
        {/* موبائل پر ٹیکسٹ سینٹر (text-center) اور بڑی اسکرین پر لیفٹ (md:text-left) */}
        <div className="max-w-4xl text-center md:text-left text-white md:text-slate-900">
          
          {/* Eyebrow */}
          <span className="inline-block mb-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-blue-400 md:text-blue-600">
            Trusted Digital Media Platform
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Insightful Content.<br />
            <span className="text-blue-400 md:text-blue-600">Curated for Growth.</span>
          </h1>

          {/* Description: موبائل پر بھی دکھانے کے لیے 'hidden' ہٹا دیا ہے یا 'block' رکھا ہے */}
          <p className="mt-6 text-base md:text-xl text-slate-200 md:text-slate-600 leading-relaxed max-w-2xl font-medium">
            Explore expert-written articles across technology, business, and lifestyle. 
            Wise Mix Media delivers clarity, depth, and value.
          </p>

          {/* Action Button (Optional) */}
          <div className="mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
              Read Articles
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}