import PDFGenerator from '@/components/Tools/PDFGenerator';
import Advertisement from '@/components/Advertisement/Advertisement';
import Link from 'next/link';

export const metadata = {
  title: 'Free Image to PDF Converter | JPG & PNG to PDF | WisemixMedia',
  description: 'Convert JPG and PNG images to PDF instantly in your browser. Privacy-first, no server uploads, and 100% free tool by WisemixMedia.',
  keywords: 'image to pdf, png to pdf, jpg to pdf converter, browser based pdf generator, WisemixMedia tools, convert photos to document',
  alternates: {
    canonical: '/tools/pdf-generator',
  },
};

export default async function ToolsPage() {
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
    <main className="container mx-auto py-10 px-4">
      {/* Breadcrumbs for SEO */}
      <nav className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
        <Link href="/" className="hover:text-blue-600">Home</Link> / 
        <Link href="/tools" className="hover:text-blue-600 mx-1">Tools</Link> / 
        <span className="text-gray-800 font-medium">PDF Generator</span>
      </nav>

      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
          Free Image to PDF Converter
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Convert your photos into professional PDF documents instantly. No registration, no watermarks.
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
      <div className="max-w-xl mx-auto mb-8 shadow-2xl rounded-3xl overflow-hidden bg-white border border-gray-100">
        <PDFGenerator />
      </div>

      {/* 3. BOTTOM AD */}
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
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">The Most Secure Way to Convert Images to PDF Online</h2>
        
        <p>Whether you are a student submitting an assignment, a freelancer sending an invoice, or a professional archiving receipts, the need for a reliable <strong>Image to PDF converter</strong> is universal. While many online services offer this feature, most require you to upload your files to their servers. At WisemixMedia, we provide a faster, safer, and 100% private solution.</p>

        

        <h3 className="text-2xl font-semibold mt-8">1. Why Privacy-First PDF Generation Matters</h3>
        <p>Documents often contain sensitive information—IDs, signatures, or personal data. Using a standard cloud-based converter means your files are temporarily stored on a server you don't control. Our <strong>PDF Generator</strong> uses client-side JavaScript. Your images are processed directly in your browser's memory and converted into a PDF file locally. Your data never leaves your computer, ensuring absolute confidentiality.</p>

        <h3 className="text-2xl font-semibold mt-8">2. High-Quality Document Preservation</h3>
        <p>A common issue with image converters is "pixelation" or loss of quality. Our tool ensures that the <strong>original resolution</strong> of your JPG or PNG is maintained within the PDF container. This makes it perfect for high-quality scans or digital artwork where detail is critical. You get a clean, professional PDF every time, without any annoying watermarks.</p>

        <h3 className="text-2xl font-semibold mt-8">3. Optimizing for SEO and Speed</h3>
        <p>From a technical standpoint, serving content via PDF is often preferred for long-form whitepapers or downloadable guides. By using our tool to bundle images, you reduce the number of HTTP requests a browser needs to make compared to loading individual images. This contributes to better <strong>Core Web Vitals</strong> for sites that offer downloadable resources.</p>

        

        <h3 className="text-2xl font-semibold mt-8">4. How to Use the PDF Generator</h3>
        <p>Using the WisemixMedia tool is straightforward and requires no technical skill:</p>
        <ol className="list-decimal pl-6 mb-6">
          <li><strong>Select Images:</strong> Click the upload button and pick your PNG or JPG files.</li>
          <li><strong>Instant Processing:</strong> Our local script prepares the document structure.</li>
          <li><strong>Generate & Save:</strong> Click the generate button and your browser will prompt you to save the PDF.</li>
        </ol>

        <h3 className="text-2xl font-semibold mt-8">5. Supported Formats and Use Cases</h3>
        <p>Our tool supports the most common web image formats, including <strong>JPEG, JPG, and PNG</strong>. Common use cases include:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Converting smartphone photos of physical documents into PDF scans.</li>
          <li>Combining multiple screenshots into a single report.</li>
          <li>Preparing graphics for professional printing.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8">6. Why Every Remote Worker Needs This Tool</h3>
        <p>Remote work often involves handling digital paperwork. Having a lightweight tool that doesn't require a subscription (like Adobe Acrobat) saves time and money. Our <strong>browser-based PDF converter</strong> works on Windows, Mac, Linux, and even mobile devices, providing a universal solution for document management on the go.</p>

        <h3 className="text-2xl font-semibold mt-8">7. Summary of Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <span className="block font-bold text-blue-900 mb-1">🔒 Zero Uploads</span>
            100% private. Your files stay on your device throughout the process.
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <span className="block font-bold text-green-900 mb-1">⚡ Instant Results</span>
            No server wait times. Download your PDF as soon as you click generate.
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <span className="block font-bold text-yellow-900 mb-1">💎 No Watermarks</span>
            Clean, professional documents ready for business or academic use.
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <span className="block font-bold text-purple-900 mb-1">🌍 Cross-Platform</span>
            Works in any modern browser without installing any software.
          </div>
        </div>

        <p className="mt-8">Simplify your document workflow today with the WisemixMedia Image to PDF Converter. It is the fastest, safest, and most efficient way to turn your visual files into digital documents.</p>
      </article>

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "WisemixMedia PDF Generator",
        "operatingSystem": "Web",
        "applicationCategory": "UtilitiesApplication",
        "description": "Convert images to PDF locally in the browser with total privacy.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      })}} />
    </main>
  );
}