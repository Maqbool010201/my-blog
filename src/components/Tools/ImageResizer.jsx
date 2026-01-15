'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [outputUrl, setOutputUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const inputRef = useRef();

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setOutputUrl(null);
    setDownloaded(false);
  };

  const handleResize = () => {
    if (!file || !width || !height) return;

    setLoading(true);
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Number(width);
      canvas.height = Number(height);

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        setOutputUrl(URL.createObjectURL(blob));
        setLoading(false);
        setDownloaded(false);
      }, 'image/webp', 0.9);
    };
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = 'resized-image.webp';
    a.click();
    setDownloaded(true);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="text-gray-500 text-sm mb-4 flex flex-wrap gap-1">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Image Resizer</span>
      </nav>

      <h2 className="text-2xl font-bold text-center">Image Resizer Tool</h2>
      <p className="text-gray-600 text-center">
        Resize images to any width and height instantly in your browser. No uploads, fully private.
      </p>

      {/* Choose File Button */}
      <div className="flex justify-center">
        <button
          onClick={() => inputRef.current.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95"
        >
          {file ? 'Change File' : 'Choose File'}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Dimension Inputs */}
      {file && (
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center mt-4">
          <input
            type="number"
            placeholder="Width (px)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full md:w-32 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Height (px)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full md:w-32 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      )}

      {/* Resize Button */}
      {file && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleResize}
            disabled={loading || !width || !height}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Resizing...' : 'Resize Image'}
          </button>
        </div>
      )}

      {/* Image Preview */}
      {file && (
        <div className="flex justify-center mt-6">
          <img
            src={outputUrl || URL.createObjectURL(file)}
            alt="Preview"
            className="max-h-64 rounded-xl shadow-lg border border-gray-200"
          />
        </div>
      )}

      {/* Download Button */}
      {outputUrl && (
        <div className="flex flex-col items-center mt-6 gap-3">
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95"
          >
            Download Resized Image
          </button>

          {/* Upload Another File */}
          {downloaded && (
            <button
              onClick={() => {
                setFile(null);
                setWidth('');
                setHeight('');
                setOutputUrl(null);
                setDownloaded(false);
              }}
              className="text-blue-600 font-semibold hover:underline mt-2"
            >
              ← Upload another file
            </button>
          )}
        </div>
      )}
    </div>
  );
}
