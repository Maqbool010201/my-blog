// src/app/loading.js
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
      <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading Wisemix Media...</p>
    </div>
  );
}