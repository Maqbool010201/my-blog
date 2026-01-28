import Link from "next/link";

export const metadata = {
  title: "Free Online Web Tools – Image Compressor, Resizer & PDF Tools | WisemixMedia",
  description:
    "Discover WisemixMedia's suite of free, privacy-first online tools. Compress images, resize photos, and convert images to 600 DPI PDF instantly in your browser. No uploads required.",
  alternates: {
    canonical: 'https://www.wisemixmedia.com/tools',
  },
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">

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
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Fast, secure, and browser-based tools to optimize your digital workflow. 
          Everything runs locally on your device—your data never leaves your browser.
        </p>
      </header>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">

        {/* Image Compressor */}
        <Link
          href="/tools/image-compressor"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2">Online Image Compressor</h2>
          <p className="text-gray-600 text-sm">
            Reduce file size of JPG, PNG, and WebP images without losing quality. Perfect for web optimization.
          </p>
        </Link>

        {/* Image Resizer */}
        <Link
          href="/tools/image-resizer"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2">Pro Image Resizer</h2>
          <p className="text-gray-600 text-sm">
            Quickly change image dimensions to any custom width and height. High-quality output instantly.
          </p>
        </Link>

        {/* PDF Generator */}
        <Link
          href="/tools/pdf-generator"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2">Image to PDF Converter</h2>
          <p className="text-gray-600 text-sm">
            Convert your photos and documents into professional PDF files directly in your browser.
          </p>
        </Link>

        {/* DPI 600 Converter */}
        <Link
          href="/tools/dpi-pdf"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2">600 DPI PDF Converter</h2>
          <p className="text-gray-600 text-sm">
            The industry standard for printing. Convert images to high-resolution 600 DPI PDFs for professional use.
          </p>
        </Link>

        {/* Coming Soon */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 opacity-75">
          <h2 className="text-xl font-bold mb-2 text-gray-400">SEO Tools (Coming Soon)</h2>
          <p className="text-gray-400 text-sm">
            More tools for keyword research and meta tag generation are under development.
          </p>
        </div>

      </div>

      {/* Bottom SEO Section */}
      <article className="max-w-4xl mx-auto border-t pt-10 text-gray-700">
         <h3 className="text-2xl font-bold mb-4">Why Use WisemixMedia Browser-Based Tools?</h3>
         <p className="mb-4">
           Unlike traditional online converters, WisemixMedia tools operate entirely within your web browser using modern JavaScript technologies like Next.js and Canvas API. This approach offers unparalleled <strong>privacy</strong> and <strong>speed</strong>.
         </p>
         <ul className="list-disc pl-5 space-y-2">
           <li><strong>Privacy First:</strong> Your files are never uploaded to any server.</li>
           <li><strong>Unlimited Use:</strong> No daily limits or subscriptions.</li>
           <li><strong>Print Ready:</strong> Specialized tools like our DPI converter ensure your files are ready for professional printing.</li>
         </ul>
      </article>
    </div>
  );
}