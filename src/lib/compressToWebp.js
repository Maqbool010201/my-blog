"use client";

import imageCompression from "browser-image-compression";

function getWebpFileName(name) {
  const base = String(name || "image").replace(/\.[^/.]+$/, "");
  return `${base}.webp`;
}

export async function compressToWebp(file) {
  if (!(file instanceof File)) {
    throw new Error("Invalid image file");
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.8,
  });

  if (compressed instanceof File && compressed.name?.toLowerCase().endsWith(".webp")) {
    return compressed;
  }

  return new File([compressed], getWebpFileName(file.name), {
    type: "image/webp",
    lastModified: Date.now(),
  });
}
