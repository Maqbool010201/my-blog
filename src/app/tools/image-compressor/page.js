import ImageCompressor from '@/components/Tools/ImageCompressor';
import Advertisement from '@/components/Advertisement/Advertisement';
import Link from 'next/link';

export const metadata = {
  title: 'Free Online Image Compressor – Optimize JPG, PNG, WebP | WisemixMedia',
  description: 'Compress images online without uploading to any server. Secure, fast, browser-based image compression tool by WisemixMedia for bloggers and developers.',
  keywords: 'image compressor, optimize images online, reduce photo size, compress jpg without losing quality, webp converter, WisemixMedia tools',
  alternates: { 
    canonical: 'https://www.wisemixmedia.com/tools/image-compressor' 
  },
};

export default async function ImageCompressorPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  let adsByPosition = {};
  try {
    const res = await fetch(
      `${baseUrl}/api/advertisements?pageType=tool&isActive=true`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const ads = await res.json();
      ads.forEach(a => {
        const key = a.position.toLowerCase().trim().replace(/\s+/g, '-');
        adsByPosition[key] = a;
      });
    }
  } catch (err) {
    console.error("Tool Ad Fetch Error:", err);
  }

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Breadcrumbs for SEO */}
      <nav className="text-sm text-gray-500 mb-6 max-w-2xl mx-auto">
        <Link href="/" className="hover:text-blue-600">Home</Link> / 
        <Link href="/tools" className="hover:text-blue-600 mx-1">Tools</Link> / 
        <span className="text-gray-800 font-medium">Image Compressor</span>
      </nav>

      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
          Free Online Image Compressor
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
          The ultimate browser-based tool for lightning-fast image optimization. Reduce file size without losing quality.
        </p>
      </header>

      {/* 1. TOP AD */}
      <div className="min-h-[100px] w-full flex justify-center mb-8">
        <Advertisement page="tool" position="content-top" adData={adsByPosition['content-top']} className="w-full max-w-4xl" />
      </div>

      <section className="max-w-3xl mx-auto mb-8 shadow-2xl rounded-3xl overflow-hidden bg-white border border-gray-100">
        <ImageCompressor />
      </section>

      {/* 2. BOTTOM AD */}
      <div className="min-h-[100px] w-full flex justify-center mb-16">
        <Advertisement page="tool" position="content-bottom" adData={adsByPosition['content-bottom']} className="w-full max-w-4xl" />
      </div>

      {/* 3. FULL ARTICLE */}
      <article className="prose prose-slate lg:prose-lg max-w-4xl mx-auto border-t pt-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">The Ultimate Guide to Browser-Based Image Compression</h2>
        
        <p>In today’s fast-paced digital landscape, the weight of your website’s assets can be the difference between a successful conversion and a bounced visitor. Images typically account for over 60% of a webpage's total weight. If these images are not optimized, your site speed will suffer, your bounce rate will climb, and your Google rankings will plummet. That is where our <strong>Online Image Compressor</strong> comes in.</p>

        

        <h3 className="text-2xl font-semibold mt-8">1. How Browser-Side (Client-Side) Compression Works</h3>
        <p>Most online tools require you to upload your files to their servers. Our tool is built on modern JavaScript technology. When you select an image, the processing happens entirely within your own browser's memory. No data is sent to WisemixMedia servers. This "Client-Side" approach ensures that even if you have a 20MB 4K photo, the compression happens locally at CPU speeds.</p>

        <h3 className="text-2xl font-semibold mt-8">2. Why Privacy is Our Top Priority</h3>
        <p>Many users are hesitant to use online tools because they don't want their personal photos or sensitive corporate graphics stored on a third-party cloud. We solve this by having <strong>zero server-side storage</strong>. Because the tool runs in your browser, your images never leave your computer. This makes our compressor ideal for:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Personal family photos.</li>
          <li>Sensitive business documents or ID scans.</li>
          <li>Proprietary website graphics before launch.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8">3. The Impact on SEO and Core Web Vitals</h3>
        <p>Google’s <strong>Core Web Vitals</strong> (specifically Largest Contentful Paint - LCP) are heavily influenced by image load times. By converting high-resolution JPGs or PNGs into optimized files, you are following Google's own recommendations for "next-gen formats." Our tool helps you achieve 90+ scores on PageSpeed Insights by reducing image payloads.</p>

        <h3 className="text-2xl font-semibold mt-8">4. Lossy vs. Lossless Compression</h3>
        <p>Our tool uses a "Smart Lossy" algorithm. It analyzes the pixels and removes data that the human eye cannot perceive. This allows for massive file size reductions (often 70-90%) while the image still looks crystal clear on retina displays.</p>

        <h3 className="text-2xl font-semibold mt-8">5. Summary of Key Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <span className="block font-bold text-blue-900 mb-1">🚀 Instant Speed</span>
            No upload or download time required. Everything happens in your browser.
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <span className="block font-bold text-green-900 mb-1">🔒 100% Private</span>
            Your files never hit our servers. Total data sovereignty for the user.
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <span className="block font-bold text-yellow-900 mb-1">📈 SEO Ready</span>
            Meets Google's standards for image optimization and mobile speed.
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <span className="block font-bold text-purple-900 mb-1">📱 Responsive</span>
            Works perfectly on Chrome, Firefox, Safari, and all mobile browsers.
          </div>
        </div>

        <p className="mt-8 text-center font-medium">In conclusion, the WisemixMedia Image Compressor is a performance-enhancing tool designed for the modern web. Start optimizing your digital assets today securely and for free.</p>
      </article>

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "WisemixMedia Image Compressor",
        "operatingSystem": "Web",
        "applicationCategory": "MultimediaApplication",
        "description": "Secure browser-based image compressor that reduces file size locally without server uploads.",
        "url": "https://www.wisemixmedia.com/tools/image-compressor",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      })}} />
    </main>
  );
}