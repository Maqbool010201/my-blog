'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [outputUrl, setOutputUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const isMobile =
    typeof window !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* Cleanup blob URLs */
  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  /* File select */
  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setWidth('');
    setHeight('');
    setOutputUrl(null);
    setError(null);

    /* Mobile-safe preview using FileReader */
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selected);

    /* Safari fix */
    e.target.value = '';
  };

  /* Resize logic */
  const handleResize = async () => {
    if (!file || !width || !height) return;

    const w = Number(width);
    const h = Number(height);

    if (w > 4000 || h > 4000) {
      setError('Dimensions too large for mobile devices.');
      return;
    }

    setLoading(true);
    setError(null);

    const img = new Image();
    img.src = preview;

    img.onerror = () => {
      setError('Failed to load image on this device.');
      setLoading(false);
    };

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError('Image processing failed.');
              setLoading(false);
              return;
            }
            setOutputUrl(URL.createObjectURL(blob));
            setLoading(false);
          },
          'image/webp',
          0.9
        );
      } catch {
        setError('Resize failed due to low memory.');
        setLoading(false);
      }
    };
  };

  /* Download */
  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = 'resized-image.webp';
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-6">

      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm flex gap-1 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Image Resizer</span>
      </nav>

      <h2 className="text-2xl font-bold text-center">Image Resizer Tool</h2>
      <p className="text-gray-600 text-center">
        Resize images directly on your device. No uploads.
      </p>

      {/* File Picker */}
      <div className="flex justify-center">
        <button
          onClick={() => inputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold active:scale-95"
        >
          {file ? 'Change Image' : 'Choose Image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Inputs */}
      {file && (
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="number"
            placeholder="Width (px)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="border rounded-xl px-4 py-2 w-full md:w-32"
          />
          <input
            type="number"
            placeholder="Height (px)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="border rounded-xl px-4 py-2 w-full md:w-32"
          />
        </div>
      )}

      {/* Resize */}
      {file && (
        <div className="flex justify-center">
          <button
            onClick={handleResize}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? 'Resizing…' : 'Resize Image'}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      {/* Preview */}
      {preview && (
        <div className="flex justify-center">
          <img
            src={outputUrl || preview}
            alt="Preview"
            className="max-h-64 w-auto rounded-xl border"
          />
        </div>
      )}

      {/* Download */}
      {outputUrl && (
        <div className="flex justify-center">
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
}
