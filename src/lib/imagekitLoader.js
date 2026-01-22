export default function imagekitLoader({ src, width, quality }) {
  if (!src) return "";

  const endpoint = "https://ik.imagekit.io/ag0dicbdub";
  
  // اگر src پہلے سے مکمل URL ہے
  if (src.toString().startsWith('http')) {
    const baseUrl = src.split('?')[0];
    return `${baseUrl}?tr=w-${width},q-${quality || 75}`;
  }

  // پاتھ کو صاف کریں
  const cleanPath = src.toString().replace(/^\/+/, '');
  return `${endpoint}/${cleanPath}?tr=w-${width},q-${quality || 75}`;
}