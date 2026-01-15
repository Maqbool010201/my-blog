"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import Link from "next/link";

export default function DPIPDFTool() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPdfUrl(null);
      setIsReady(false);
      setHasDownloaded(false);
    };
    reader.readAsDataURL(file);
  };

  const generatePDF = () => {
    if (!image) return;

    setLoading(true);

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const dpi = 600;
      const mmPerInch = 25.4;

      const widthMM = (img.width / dpi) * mmPerInch;
      const heightMM = (img.height / dpi) * mmPerInch;

      const pdf = new jsPDF({
        orientation: widthMM > heightMM ? "landscape" : "portrait",
        unit: "mm",
        format: [widthMM, heightMM],
      });

      pdf.addImage(image, "PNG", 0, 0, widthMM, heightMM);

      const blob = pdf.output("blob");
      setPdfUrl(URL.createObjectURL(blob));
      setIsReady(true);
      setLoading(false);
    };
  };

  const handleDownload = () => {
    if (!pdfUrl) return;

    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "image-600dpi.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setHasDownloaded(true);
    setIsReady(false);
  };

  const resetTool = () => {
    setImage(null);
    setPdfUrl(null);
    setIsReady(false);
    setHasDownloaded(false);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">

        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 flex gap-1 flex-wrap">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:underline">Tools</Link>
          <span>/</span>
          <span className="text-gray-700 font-semibold">Image to 600 DPI PDF</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Image to 600 DPI PDF
        </h1>

        <p className="text-gray-600 text-center max-w-xl mx-auto">
          Upload an image and convert it into a high-quality 600 DPI PDF.
          Everything runs locally in your browser — fast and private.
        </p>

        {/* Upload */}
        {!image && (
          <div className="flex justify-center">
            <button
              onClick={() => inputRef.current.click()}
              className="
                bg-blue-600 hover:bg-blue-700
                text-white font-semibold
                px-6 py-3 rounded-xl
                shadow-lg transition active:scale-95
              "
            >
              Choose Image
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Preview */}
        {image && (
          <div className="flex justify-center">
            <img
              src={image}
              alt="Preview"
              className="max-h-72 rounded-xl border shadow-md"
            />
          </div>
        )}

        {/* Convert Button */}
        {image && !isReady && !hasDownloaded && (
          <div className="flex justify-center">
            <button
              onClick={generatePDF}
              disabled={loading}
              className="
                bg-green-600 hover:bg-green-700
                text-white font-semibold
                px-8 py-3 rounded-xl
                shadow-lg transition
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95
              "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                      className="opacity-75"
                    />
                  </svg>
                  Converting…
                </span>
              ) : (
                "Convert to 600 DPI PDF"
              )}
            </button>
          </div>
        )}

        {/* Download Button */}
        {isReady && !hasDownloaded && (
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700
                text-white font-semibold
                px-8 py-3 rounded-xl
                shadow-lg border border-indigo-700/30
                transition active:scale-95
              "
            >
              ⬇ Download PDF (600 DPI)
            </button>
          </div>
        )}

        {/* After Download */}
        {hasDownloaded && (
          <div className="text-center space-y-3">
            <p className="text-green-600 font-semibold">
              ✔ Download completed successfully
            </p>
            <button
              onClick={resetTool}
              className="text-blue-600 hover:underline font-medium"
            >
              Convert another image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
