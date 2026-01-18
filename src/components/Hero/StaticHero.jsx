export default function StaticHero() {
  return (
    <section className="relative w-full h-112.5 sm:h-125 lg:h-162.5 overflow-hidden bg-slate-900 flex items-center justify-center md:justify-start">
      
      {/* CSS Gradient Background: تصویر کا رولہ ختم */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90" />
      
      {/* Decorative Circles: بیک گراؤنڈ کو خوبصورت بنانے کے لیے ہلکے سے گول دائرے */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl z-0" />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl text-center md:text-left">
          
          <span className="inline-block mb-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-blue-400">
            Trusted Digital Media Platform
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-white">
            Insightful Content.<br />
            <span className="text-blue-400">Curated for Growth.</span>
          </h1>

          <p className="mt-6 text-base md:text-xl text-slate-300 leading-relaxed max-w-2xl font-medium">
            Explore expert-written articles across technology, business, and lifestyle. 
            Wise Mix Media delivers clarity, depth, and value.
          </p>

          <div className="mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 cursor-pointer shadow-lg shadow-blue-600/20">
              Read Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}