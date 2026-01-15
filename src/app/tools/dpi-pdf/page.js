import DPIPDFTool from "@/components/Tools/DPIPDFTool";
import Advertisement from '@/components/Advertisement/Advertisement';
import Link from 'next/link';

export const metadata = {
  title: "PDF or Image to DPI Converter (600 DPI Online) – WisemixMedia",
  description:
    "Convert PDF or images to high-resolution DPI (600 DPI or custom) directly in your browser. Free, fast, private, and fully client-side DPI converter by WisemixMedia.",
  alternates: {
    canonical: '/tools/dpi-converter',
  },
};

export default async function DPIPDFPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Fetch Ads logic
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
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="text-gray-500 text-sm mb-6 flex flex-wrap gap-1 max-w-4xl mx-auto">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Image to DPI Converter</span>
      </nav>

      {/* Page Heading */}
      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
          Image & PDF to DPI Converter
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your digital files into high-quality, print-ready documents at 600 DPI or custom resolutions.
        </p>
      </header>

      {/* 1. TOP AD */}
      <div className="min-h-[100px] w-full flex justify-center mb-10">
        <Advertisement 
          page="tool" 
          position="content-top" 
          adData={adsByPosition['content-top']} 
          className="w-full max-w-4xl" 
        />
      </div>

      {/* 2. THE TOOL */}
      <section className="mb-10 shadow-2xl rounded-3xl overflow-hidden bg-white border border-gray-100 p-2 md:p-6">
        <DPIPDFTool />
      </section>

      {/* 3. BOTTOM AD (Directly under the tool) */}
      <div className="min-h-[100px] w-full flex justify-center mb-20">
        <Advertisement 
          page="tool" 
          position="content-bottom" 
          adData={adsByPosition['content-bottom']} 
          className="w-full max-w-4xl" 
        />
      </div>

      {/* 4. EXPANDED SEO ARTICLE (800+ Words) */}
      <article className="max-w-4xl mx-auto prose prose-slate lg:prose-lg border-t pt-16">
        <h2 className="text-3xl font-bold text-gray-800">Understanding DPI: The Science of High-Resolution Printing</h2>
        <p>DPI, or <strong>Dots Per Inch</strong>, is a technical measurement that dictates the quality of a printed image. While many users focus on pixel count, DPI determines how those pixels are distributed across a physical surface like paper. A 1000px image printed at 72 DPI will look large but blurry, whereas the same image at <strong>300 or 600 DPI</strong> will be smaller but incredibly sharp. Our converter helps you bridge the gap between digital screen display and professional print requirements.</p>

        

        <h3 className="text-2xl font-semibold mt-8">Why 600 DPI is the Industry Standard for Quality</h3>
        <p>For most standard home printing, 300 DPI is sufficient. However, for professional publishing, scientific archiving, or legal documents, <strong>600 DPI</strong> is mandatory. It ensures that fine lines, small text, and intricate details are captured without "stair-stepping" (aliasing). By using the WisemixMedia DPI converter, you ensure your PDF documents meet the strict submission guidelines of publishers and government agencies.</p>

        <h3 className="text-2xl font-semibold mt-8">100% Privacy via Browser-Side Conversion</h3>
        <p>Handling sensitive documents? Unlike other converters, we don't use server-side APIs to process your files. We use <strong>Client-Side Rendering (CSR)</strong>. This means:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>No Data Leaves Your Device:</strong> Your bank statements, IDs, or proprietary designs stay in your browser.</li>
          <li><strong>Instant Processing:</strong> No waiting in a server queue. Your local CPU does the heavy lifting.</li>
          <li><strong>Offline Capability:</strong> Once the page is loaded, you can technically convert files even if your internet disconnects.</li>
        </ul>

        

        <h2 className="text-3xl font-bold text-gray-800 mt-12">How to Use the DPI Converter for Best Results</h2>
        <p>To get a true high-resolution output, start with the highest quality image possible. While our tool can reconfigure any image to a 600 DPI PDF metadata structure, the "clarity" of the result depends on the source pixels. For professional results:</p>
        <ol className="list-decimal pl-6 mb-6">
          <li>Upload your high-resolution PNG or JPG.</li>
          <li>Select your target DPI (600 is recommended for professional print).</li>
          <li>Click convert and let our local script recalculate the physical dimensions.</li>
          <li>Download your print-ready PDF file instantly.</li>
        </ol>

        <h2 className="text-3xl font-bold text-gray-800 mt-12">The Impact on Web Performance and SEO</h2>
        <p>Optimizing image resolution is a key part of <strong>Technical SEO</strong>. While high DPI is for printing, understanding the relationship between resolution and file size helps you manage <strong>Core Web Vitals</strong>. Using a 600 DPI image on a website would be a mistake because it would be too heavy; however, providing a 600 DPI PDF download is an excellent way to provide value to your users without slowing down your landing page.</p>

        <h3 className="text-2xl font-semibold mt-8">Frequently Asked Questions</h3>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900">Does this tool up-scale my images?</h4>
            <p className="text-gray-700 text-sm">Yes, the tool recalculates the pixel density to fit the requested DPI. If you start with a very small image, it will be sharp but smaller in physical size when printed.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900">Is this tool free for commercial use?</h4>
            <p className="text-gray-700 text-sm">Absolutely. WisemixMedia provides this tool 100% free for designers, publishers, and developers to use for any project.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mt-12">Summary of Technical Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <span className="block font-bold text-blue-900 mb-1">🚀 Fast Processing</span>
            Leverages your local device speed for near-instant conversion.
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <span className="block font-bold text-green-900 mb-1">🔒 High Privacy</span>
            Images never touch a server. Perfect for sensitive documentation.
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <span className="block font-bold text-yellow-900 mb-1">📑 Print Ready</span>
            Export directly to PDF with embedded DPI metadata for professional shops.
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <span className="block font-bold text-purple-900 mb-1">🚫 No Watermarks</span>
            Your documents remain clean and professional for any use case.
          </div>
        </div>

        <p className="mt-8">The WisemixMedia Image & PDF to DPI Converter is the most efficient browser-side solution for your high-resolution needs. Try it today and experience professional-grade results without the privacy risks of cloud-based tools.</p>
      </article>

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "WisemixMedia DPI Converter",
        "operatingSystem": "Web",
        "applicationCategory": "UtilitiesApplication",
        "description": "Convert images and PDFs to high-resolution 600 DPI print-ready files locally.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      })}} />
    </div>
  );
}