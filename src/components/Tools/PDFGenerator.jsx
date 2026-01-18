"use client";

import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import Link from "next/link";

export default function PDFGenerator() {
  const [image, setImage] = useState(null);
  const [imageType, setImageType] = useState("JPEG");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  /* Cleanup blob URL */
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setDownloadUrl(null);

    setImageType(file.type.includes("png") ? "PNG" : "JPEG");

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);

    /* Safari reselect fix */
    e.target.value = "";
  };

  const generatePDF = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    const img = new Image();
    img.src = image;

    img.onerror = () => {
      setError("Failed to load image on this device.");
      setLoading(false);
    };

    img.onload = () => {
      try {
        /* Downscale for mobile safety */
        const MAX_WIDTH = 2000;
        const ratio = Math.min(1, MAX_WIDTH / img.width);

        const canvas = document.createElement("canvas");
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext("2d", { alpha: false });
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imgData = canvas.toDataURL(
          imageType === "PNG" ? "image/png" : "image/jpeg",
          0.9
        );

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight =
          (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, imageType, 0, 0, pageWidth, pageHeight);

        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);

        setDownloadUrl(url);
        setLoading(false);
      } catch {
        setError("PDF generation failed due to memory limits.");
        setLoading(false);
      }
    };
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "converted-document.pdf";
    a.click();

    setDownloadUrl(null);
    setImage(null);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-6">

      <nav className="text-gray-500 text-sm flex gap-1 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">PDF Generator</span>
      </nav>

      <h2 className="text-2xl font-bold text-center">Image to PDF Converter</h2>
      <p className="text-gray-600 text-center">
        Convert images to PDF directly on your device.
      </p>

      <div className="flex justify-center">
        <button
          onClick={() => inputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          {image ? "Change Image" : "Choose Image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {image && (
        <div className="flex justify-center">
          <img
            src={image}
            alt="Preview"
            className="max-h-64 rounded-xl border object-contain"
          />
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      {image && (
        <div className="flex justify-center">
          {!downloadUrl ? (
            <button
              onClick={generatePDF}
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {loading ? "Generating PDF…" : "Generate PDF"}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
            >
              Download PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
