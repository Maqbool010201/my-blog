export default function imagekitLoader({ src, width, quality }) {
  if (!src) return "";

  // 1. اگر ڈیٹا بیس میں پورا لنک (http) موجود ہے
  if (src.startsWith('http')) {
    // لنک سے پرانے ٹرانسفارمیشن یا updatedAt پیرامیٹرز ہٹانا
    const baseUrl = src.split('?')[0];
    return `${baseUrl}?tr=w-${width},q-${quality || 75}`;
  }

  // 2. اگر صرف پاتھ ہے
  const endpoint = "https://ik.imagekit.io/ag0dicbdub";
  const cleanPath = src.replace(/^\/+/, ''); // شروع کا سلیش ختم کرنا
  
  return `${endpoint}/${cleanPath}?tr=w-${width},q-${quality || 75}`;
}