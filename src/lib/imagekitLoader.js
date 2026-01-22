export default function imagekitLoader({ src, width, quality }) {
  if (!src) return "";

  // 1. اینڈ پوائنٹ کے آخر سے سلیش ہٹا دیں (اگر موجود ہو)
  const endpoint = "https://ik.imagekit.io/ag0dicbdub";
  
  // 2. ڈیٹا بیس والے پاتھ (src) کے شروع سے سلیش ہٹا دیں
  const cleanPath = src.replace(/^\/+/, '');
  
  // 3. اب ان کو جوڑیں (صرف ایک سلیش کے ساتھ)
  return `${endpoint}/${cleanPath}?tr=w-${width},q-${quality || 75}`;
}