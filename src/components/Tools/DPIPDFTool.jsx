"use client";

import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import Link from "next/link";

export default function DPIPDFTool() {
  const [image, setImage] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setPdfUrl(null);
      setDownloaded(false);
    };
    reader.readAsDataURL(file);

    e.target.value = ""; // Safari reselect fix
  };

  const generatePDF = () => {
    if (!image) return;
    setLoading(true);

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const dpi = 600;
      const mmPerInch = 25.4;

      // Use naturalWidth for true pixel count
      const widthMM = (img.naturalWidth / dpi) * mmPerInch;
      const heightMM = (img.naturalHeight / dpi) * mmPerInch;

      const pdf = new jsPDF({
        orientation: widthMM > heightMM ? "landscape" : "portrait",
        unit: "mm",
        format: [widthMM, heightMM],
      });

      pdf.addImage(image, "PNG", 0, 0, widthMM, heightMM);

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
    };

    img.onerror = () => {
      alert("Failed to load image. Please try a different file.");
      setLoading(false);
    };
  };

  const handleDownload = () => {
    if (!pdfUrl) return;

    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "image-600dpi.pdf";
    a.click();

    setDownloaded(true);
    setPdfUrl(null);
    setImage(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
        <nav className="text-sm text-gray-500 flex flex-wrap gap-1">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:underline">Tools</Link>
          <span>/</span>
          <span className="text-gray-700 font-semibold">Image to 600 DPI PDF</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-center">Image to 600 DPI PDF</h1>
        <p className="text-gray-600 text-center max-w-xl mx-auto">
          Upload an image and convert it to a high-quality 600 DPI PDF directly in your browser.
        </p>

        {!image && (
          <div className="flex justify-center">
            <button
              onClick={() => inputRef.current.click()}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
            >
              Choose Image
            </button>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              ref={inputRef}
              className="hidden"
            />
          </div>
        )}

        {image && (
          <div className="flex justify-center">
            <img
              src={image}
              alt="Preview"
              className="max-h-72 rounded-xl border shadow-md object-contain"
            />
          </div>
        )}

        {image && !pdfUrl && (
          <div className="flex justify-center mt-4">
            <button
              onClick={generatePDF}
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Converting…" : "Convert to 600 DPI PDF"}
            </button>
          </div>
        )}

        {pdfUrl && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold"
            >
              ⬇ Download PDF
            </button>
          </div>
        )}

        {downloaded && (
          <div className="text-center mt-4">
            <p className="text-green-600 font-semibold">✔ Download complete</p>
            <button
              onClick={() => setDownloaded(false)}
              className="text-blue-600 hover:underline mt-2"
            >
              Convert another image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
