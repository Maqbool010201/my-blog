import Link from "next/link";

export const metadata = {
  title: "Free Online Web Tools – Image Compressor, Resizer, PDF & 600 DPI Converter | WisemixMedia",
  description:
    "Discover WisemixMedia's suite of free, privacy-first online tools. 1. Image Compressor: Reduce file size without quality loss. 2. Image Resizer: Change dimensions instantly. 3. PDF Generator: Convert images to PDF. 4. 600 DPI Converter: Professional high-resolution output. No uploads required.",
  keywords: [
    "image compressor", 
    "image resizer", 
    "image to pdf", 
    "600 dpi converter", 
    "online web tools", 
    "WisemixMedia tools",
    "privacy-first tools"
  ],
  alternates: {
    canonical: 'https://www.wisemixmedia.com/tools',
  },
  openGraph: {
    title: "Powerful & Private Online Web Tools | WisemixMedia",
    description: "Compress, Resize, and Convert images to PDF or 600 DPI instantly in your browser with 100% privacy.",
    url: 'https://www.wisemixmedia.com/tools',
    siteName: 'WisemixMedia',
    type: 'website',
  },
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* Structured Data for SEO - Essential for Google to index all 4 tools */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "WisemixMedia Online Tools Collection",
            "description": "A collection of browser-based tools for image optimization and PDF generation.",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Online Image Compressor",
                "url": "https://www.wisemixmedia.com/tools/image-compressor"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Pro Image Resizer",
                "url": "https://www.wisemixmedia.com/tools/image-resizer"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Image to PDF Converter",
                "url": "https://www.wisemixmedia.com/tools/pdf-generator"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "600 DPI PDF Converter",
                "url": "https://www.wisemixmedia.com/tools/dpi-pdf"
              }
            ]
          }),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="text-gray-500 text-sm mb-4 flex flex-wrap gap-1">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Tools Hub</span>
      </nav>

      {/* Hero Title */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Powerful & Private Online Tools
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg text-balance">
          Fast, secure, and browser-based tools to optimize your digital workflow. 
          Everything runs locally on your device—your data never leaves your browser.
        </p>
      </header>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">

        {/* 1. Image Compressor */}
        <Link
          href="/tools/image-compressor"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2">Online Image Compressor</h2>
          <p className="text-gray-600 text-sm">
            Reduce file size of JPG, PNG, and WebP images without losing quality. Perfect for web optimization and SEO.
          </p>
        </Link>

        {/* 2. Image Resizer */}
        <Link
          href="/tools/image-resizer"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2">Pro Image Resizer</h2>
          <p className="text-gray-600 text-sm">
            Quickly change image dimensions to any custom width and height. High-quality output for social media and web.
          </p>
        </Link>

        {/* 3. PDF Generator */}
        <Link
          href="/tools/pdf-generator"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2">Image to PDF Converter</h2>
          <p className="text-gray-600 text-sm">
            Convert your photos and documents into professional PDF files directly in your browser. Clean and watermark-free.
          </p>
        </Link>

        {/* 4. DPI 600 Converter */}
        <Link
          href="/tools/dpi-pdf"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2">600 DPI PDF Converter</h2>
          <p className="text-gray-600 text-sm">
            The industry standard for printing. Convert images to high-resolution 600 DPI PDFs for visa and official use.
          </p>
        </Link>

        {/* Coming Soon */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 opacity-75">
          <h2 className="text-xl font-bold mb-2 text-gray-400">SEO Tools (Coming Soon)</h2>
          <p className="text-gray-400 text-sm">
            More tools for keyword research and meta tag generation are under development to boost your traffic.
          </p>
        </div>

      </div>

      {/* Bottom SEO Section */}
      <article className="max-w-4xl mx-auto border-t pt-10 text-gray-700 prose prose-slate">
          <h3 className="text-2xl font-bold mb-4">Why Use WisemixMedia Browser-Based Tools?</h3>
          <p className="mb-4 text-lg">
            Unlike traditional online converters, WisemixMedia tools operate entirely within your web browser using modern technologies. This approach offers unparalleled <strong>privacy</strong> and <strong>speed</strong>.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-slate-50 p-5 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">🚀 Speed & Performance</h4>
              <p className="text-sm">Since no files are uploaded to a server, our <strong>Image Compressor</strong> and <strong>Resizer</strong> work at the speed of your local processor.</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">🛡️ Absolute Privacy</h4>
              <p className="text-sm">Whether using our <strong>PDF Generator</strong> or <strong>DPI Converter</strong>, your sensitive data never leaves your device.</p>
            </div>
          </div>

          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Privacy First:</strong> Your files are never uploaded, stored, or logged on any server.</li>
            <li><strong>Unlimited Use:</strong> No daily limits, no account required, and 100% free forever.</li>
            <li><strong>Print Ready:</strong> Specialized 600 DPI tools ensure your documents are ready for high-quality professional printing.</li>
          </ul>
      </article>
    </div>
  );
}