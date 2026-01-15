import ImageResizer from '@/components/Tools/ImageResizer';
import Advertisement from '@/components/Advertisement/Advertisement';

export const metadata = {
  title: 'Free Online Image Resizer – Resize JPG, PNG, WebP Without Upload | WisemixMedia',
  description: 'Resize images online by custom width and height instantly. Secure, fast, and privacy-first image resizing tool with no server uploads.',
  alternates: {
    canonical: '/tools/image-resizer',
  },
};

export default async function ImageResizerPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Fetch Ads logic (Same as Compressor)
  let adsByPosition = {};
  try {
    const res = await fetch(
      `${baseUrl}/api/advertisements?pageType=tool&isActive=true`,
      { next: { revalidate: 60 } }
    );
    const ads = await res.json();
    ads.forEach(a => {
      const key = a.position.toLowerCase().trim().replace(/\s+/g, '-');
      adsByPosition[key] = a;
    });
  } catch (err) {
    console.error("Tool Ad Fetch Error:", err);
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
          Free Online Image Resizer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Change image dimensions in seconds. Professional, secure, and 100% browser-side resizing.
        </p>
      </header>

      {/* 1. TOP AD */}
      <div className="min-h-[100px] w-full flex justify-center mb-8">
        <Advertisement 
          page="tool" 
          position="content-top" 
          adData={adsByPosition['content-top']} 
          className="w-full max-w-4xl" 
        />
      </div>

      {/* 2. THE TOOL */}
      <section className="mb-8 shadow-2xl rounded-3xl overflow-hidden bg-white border border-gray-100">
        <ImageResizer />
      </section>

      {/* 3. BOTTOM AD (Directly under the tool) */}
      <div className="min-h-[100px] w-full flex justify-center mb-16">
        <Advertisement 
          page="tool" 
          position="content-bottom" 
          adData={adsByPosition['content-bottom']} 
          className="w-full max-w-4xl" 
        />
      </div>

      {/* 4. LONG SEO ARTICLE (800+ Words Structure) */}
      <article className="prose prose-slate lg:prose-lg max-w-4xl mx-auto border-t pt-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Why Accurate Image Resizing Matters for the Modern Web</h2>
        
        <p>In the world of web development and digital marketing, "one size fits all" does not apply to imagery. A high-resolution photo taken from a DSLR might look stunning, but if it is 5000 pixels wide and you only need it for a small blog thumbnail, you are wasting bandwidth and slowing down your site. Our <strong>Online Image Resizer</strong> is designed to solve this exact problem while maintaining the highest possible privacy standards.</p>

        

        <h3 className="text-2xl font-semibold mt-8">1. Browser-Side Technology: How It Works</h3>
        <p>Most traditional image resizers require you to upload your file to their server, where a script processes it and lets you download it back. This creates two major issues: data consumption and privacy risks. Our tool utilizes the <strong>HTML5 Canvas API</strong>. When you select an image, your browser creates a local "canvas" and redraws the image to your exact specified width and height. This process happens in milliseconds and uses your local CPU power, meaning no data ever leaves your device.</p>

        <h3 className="text-2xl font-semibold mt-8">2. The Importance of Aspect Ratio</h3>
        <p>Resizing an image isn't just about changing numbers; it's about maintaining visual integrity. If you change the width without adjusting the height proportionally, the image will look "stretched" or "squashed." Our tool includes smart calculations to help you maintain the <strong>original aspect ratio</strong>, ensuring that your subjects look natural while meeting the specific pixel requirements of platforms like Instagram, Facebook, or your personal blog.</p>

        <h3 className="text-2xl font-semibold mt-8">3. SEO Benefits: Improving Core Web Vitals</h3>
        <p>Google’s <strong>Core Web Vitals</strong> (specifically CLS - Cumulative Layout Shift) can be negatively affected if you don't define image dimensions. By resizing your images to the exact size they will be displayed on your website, you reduce "oversized images" warnings in PageSpeed Insights. This results in:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Faster Load Times:</strong> Smaller dimensions lead to smaller file sizes.</li>
          <li><strong>Better Mobile UX:</strong> Mobile users on slow 4G/5G connections save data.</li>
          <li><strong>Improved Crawl Budget:</strong> Search engines can index your optimized pages more efficiently.</li>
        </ul>

        

        <h3 className="text-2xl font-semibold mt-8">4. Privacy-First Image Processing</h3>
        <p>In an era of data breaches, privacy is non-negotiable. Whether you are resizing sensitive identity documents for a secure application or private company graphics, you can trust WisemixMedia. Since our code runs <strong>locally in your browser</strong>, we never see your images. There are no logs, no temp folders, and no cloud storage involved.</p>

        <h3 className="text-2xl font-semibold mt-8">5. Supported Formats for All Occasions</h3>
        <p>We support all modern web formats, including <strong>JPG, PNG, and WebP</strong>. 
        If you are looking for the best performance, we recommend resizing and then saving as WebP. If you need transparency (no background), our resizer handles PNG files perfectly without adding unwanted white backgrounds.</p>

        <h3 className="text-2xl font-semibold mt-8">6. Why Every Blogger Needs a Reliable Resizer</h3>
        <p>Bloggers often face the challenge of different requirements for "Featured Images" vs. "In-post Images." Using our tool, you can create a standard workflow. For example, you can quickly resize all featured images to 1200x630 pixels for perfect OpenGraph display on social media. This consistency makes your blog look professional and polished.</p>

        <h3 className="text-2xl font-semibold mt-8">7. Summary of Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <span className="block font-bold text-blue-900 mb-1">📏 Custom Dimensions</span>
            Set exact width and height pixels for any platform.
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <span className="block font-bold text-green-900 mb-1">⚡ Instant Download</span>
            No waiting for server processing. Get your files immediately.
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <span className="block font-bold text-yellow-900 mb-1">🛡️ Data Security</span>
            Zero uploads. Your privacy is protected by design.
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <span className="block font-bold text-purple-900 mb-1">✨ Lossless Quality</span>
            High-quality resampling algorithms to keep images sharp.
          </div>
        </div>

        <p className="mt-8">Stop struggling with heavy image editing software. Use the WisemixMedia Image Resizer to prepare your assets for the web quickly and securely. Optimized images are just a few clicks away.</p>
      </article>

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "WisemixMedia Image Resizer",
        "operatingSystem": "Web",
        "applicationCategory": "DesignApplication",
        "description": "Resize images online to custom dimensions without uploading to any server.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      })}} />
    </div>
  );
}