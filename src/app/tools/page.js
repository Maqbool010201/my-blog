import Link from "next/link";

export const metadata = {
  title: "Free Online Tools – WisemixMedia",
  description:
    "All free online web tools by WisemixMedia including Image Compressor, Image Resizer, PDF Generator, DPI 600 Converter, SEO tools, and more. Privacy-first, browser-based tools to optimize images and improve website performance.",
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
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        Tools Hub
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Access all our privacy-first, browser-based tools to optimize images, convert files, improve SEO, and enhance website performance.
        No uploads, no tracking — everything runs securely in your browser.
      </p>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Image Compressor */}
        <Link
          href="/tools/image-compressor"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          <h2 className="text-xl font-bold mb-2">Image Compressor</h2>
          <p className="text-gray-600">
            Compress JPG, PNG, and WebP images directly in your browser. No uploads, fast and secure.
          </p>
        </Link>

        {/* Image Resizer */}
        <Link
          href="/tools/image-resizer"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          <h2 className="text-xl font-bold mb-2">Image Resizer</h2>
          <p className="text-gray-600">
            Resize images to any custom width and height instantly in your browser. Privacy-first and fully client-side.
          </p>
        </Link>

        {/* PDF Generator */}
        <Link
          href="/tools/pdf-generator"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          <h2 className="text-xl font-bold mb-2">PDF Generator</h2>
          <p className="text-gray-600">
            Convert images to PDF instantly in your browser. Fully client-side, fast, and private.
          </p>
        </Link>

        {/* DPI 600 Converter (FIXED PATH) */}
        <Link
          href="/tools/dpi-pdf"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          <h2 className="text-xl font-bold mb-2">DPI 600 Converter</h2>
          <p className="text-gray-600">
            Convert images to high-quality 600 DPI PDF files. Perfect for printing, forms, and professional documents.
          </p>
        </Link>

        {/* Future Tool */}
        <Link
          href="#"
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 opacity-50 cursor-not-allowed"
        >
          <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
          <p className="text-gray-400">
            More browser-based tools are coming soon. Stay tuned!
          </p>
        </Link>

      </div>
    </div>
  );
}
