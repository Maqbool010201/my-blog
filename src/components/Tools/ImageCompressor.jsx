'use client';

import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import Link from 'next/link';

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const [format, setFormat] = useState('image/webp');
  const [status, setStatus] = useState('idle'); // idle, selected, processing, done
  const inputRef = useRef();

  const onSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setOutput(null);
    setStatus('selected');
  };

  const handleCompression = async () => {
    if (!file) return;
    setStatus('processing');

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: format,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      setOutput({
        url: URL.createObjectURL(compressedBlob),
        size: (compressedBlob.size / 1024).toFixed(2),
        oldSize: (file.size / 1024).toFixed(2),
        name: file.name.split('.')[0],
      });
      setStatus('done');
    } catch (error) {
      console.error('Compression Error:', error);
      setStatus('selected');
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const a = document.createElement('a');
    a.href = output.url;
    a.download = `${output.name}-compressed.${format.split('/')[1]}`;
    a.click();
    setStatus('done'); // keep done to show "Upload Another File" link
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="text-gray-500 text-sm mb-4">
        <Link href="/" className="hover:underline">Home</Link> / 
        <Link href="/tools" className="hover:underline ml-1">Tools</Link> / 
        <span className="ml-1 text-gray-700 font-semibold">Image Compressor</span>
      </nav>

      <h2 className="text-2xl font-bold text-center">Image Compressor Tool</h2>
      <p className="text-gray-600 text-center">
        Compress and convert images directly in your browser. Privacy-first, no uploads.
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
          onChange={onSelectFile}
          className="hidden"
        />
      </div>

      {/* Format selector & Compress button */}
      {status === 'selected' && (
        <div className="mt-4 flex flex-col md:flex-row gap-4 justify-center items-center">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
          </select>

          <button
            onClick={handleCompression}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95"
          >
            Compress Image
          </button>
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="flex justify-center mt-6">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 rounded-xl shadow-lg border border-gray-200"
          />
        </div>
      )}

      {/* Output & Download */}
      {output && (
        <div className="flex flex-col items-center mt-6 gap-3">
          <div className="flex gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-center">
              <p className="text-sm text-gray-400 uppercase font-bold">Original</p>
              <p className="font-bold text-gray-700">{output.oldSize} KB</p>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-sm text-green-400 uppercase font-bold">Compressed</p>
              <p className="font-bold text-green-600">{output.size} KB</p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95"
          >
            Download Compressed Image
          </button>

          {/* Upload Another File */}
          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
              setOutput(null);
              setStatus('idle');
            }}
            className="text-blue-600 font-semibold hover:underline mt-2"
          >
            ← Upload another file
          </button>
        </div>
      )}
    </div>
  );
}
