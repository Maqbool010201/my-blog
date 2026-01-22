export default function imagekitLoader({ src, width, quality }) {
  if (!src) return "";
  if (src.startsWith('http')) return src;

  const endpoint = "https://ik.imagekit.io/ag0dicbdub";
  
  // پاتھ سے تمام شروع کے سلیش ہٹا دیں (جیسے /uploads بن جائے گا uploads)
  const cleanPath = src.replace(/^\/+/, '');
  
  return `${endpoint}/${cleanPath}?tr=w-${width},q-${quality || 75}`;
}