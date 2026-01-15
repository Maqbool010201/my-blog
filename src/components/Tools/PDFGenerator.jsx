"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import Link from "next/link";

export default function PDFGenerator() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const inputRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setDownloadUrl(null);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const generatePDF = () => {
    if (!image) return;
    setLoading(true);

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(image);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Convert PDF to blob URL for download
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url); // show download button
      setLoading(false);
    };
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "converted-document.pdf";
    a.click();

    // Hide download button after click
    setDownloadUrl(null);
    setImage(null);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-6">

      {/* Breadcrumbs */}
      <nav className="text-gray-500 text-sm mb-4 flex flex-wrap gap-1">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">PDF Generator</span>
      </nav>

      <h2 className="text-2xl font-bold text-center">Image to PDF Converter</h2>
      <p className="text-gray-600 text-center">
        Convert your images to PDF instantly in your browser. Fully private, no uploads.
      </p>

      {/* Choose File Button */}
      <div className="flex justify-center">
        <button
          onClick={() => inputRef.current.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95"
        >
          {image ? "Change Image" : "Choose Image"}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Image Preview */}
      {image && (
        <div className="flex justify-center mt-6">
          <img
            src={image}
            alt="Preview"
            className="max-h-64 w-auto rounded-xl shadow-lg border border-gray-200 object-contain"
          />
        </div>
      )}

      {/* Generate / Download Button */}
      {image && (
        <div className="flex justify-center mt-4 gap-4 flex-wrap">
          {!downloadUrl && (
            <button
              onClick={generatePDF}
              disabled={loading}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              )}
              {loading ? "Generating PDF..." : "Generate PDF"}
            </button>
          )}

          {downloadUrl && (
            <button
              onClick={handleDownload}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform active:scale-95"
            >
              Download PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
