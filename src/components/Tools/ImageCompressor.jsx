'use client';

import { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import Link from 'next/link';

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const [format, setFormat] = useState('image/webp');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const isMobile = typeof window !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (output?.url) URL.revokeObjectURL(output.url);
    };
  }, [preview, output]);

  const onSelectFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setOutput(null);
    setError(null);
    setStatus('selected');

    // Safari fix
    e.target.value = '';
  };

  const handleCompression = async () => {
    if (!file) return;

    setStatus('processing');
    setError(null);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: isMobile ? 1280 : 1920,
        useWebWorker: !isMobile,
        fileType: format,
      });

      setOutput({
        url: URL.createObjectURL(compressed),
        size: (compressed.size / 1024).toFixed(1),
        oldSize: (file.size / 1024).toFixed(1),
        name: file.name.replace(/\.[^/.]+$/, ''),
      });

      setStatus('done');
    } catch (err) {
      console.error(err);
      setError('Image compression failed on this device. Try a smaller image.');
      setStatus('selected');
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const a = document.createElement('a');
    a.href = output.url;
    a.download = `${output.name}.${format.split('/')[1]}`;
    a.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-5 space-y-5">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500">
        <Link href="/">Home</Link> / <Link href="/tools">Tools</Link> / Image Compressor
      </nav>

      <h2 className="text-xl font-bold text-center">Image Compressor</h2>
      <p className="text-sm text-center text-gray-600">
        Compress images locally on your device. No uploads.
      </p>

      {/* File Picker */}
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold active:scale-95"
      >
        {file ? 'Change Image' : 'Choose Image'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onSelectFile}
      />

      {/* Controls */}
      {status === 'selected' && (
        <div className="flex flex-col gap-3">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
          </select>

          <button
            onClick={handleCompression}
            className="bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Compress Image
          </button>
        </div>
      )}

      {/* Status */}
      {status === 'processing' && (
        <p className="text-center text-sm text-gray-500">Processing image…</p>
      )}

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full max-h-60 object-contain rounded-lg border"
        />
      )}

      {/* Output */}
      {output && (
        <div className="space-y-3 text-center">
          <p className="text-sm">
            {output.oldSize} KB → <strong>{output.size} KB</strong>
          </p>

          <button
            onClick={handleDownload}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold"
          >
            Download
          </button>

          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
              setOutput(null);
              setStatus('idle');
            }}
            className="text-sm text-blue-600 underline"
          >
            Upload another image
          </button>
        </div>
      )}
    </div>
  );
}
