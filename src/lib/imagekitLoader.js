// src/lib/imagekitLoader.js
export default function imagekitLoader({ src, width, quality }) {
  // اگر src میں پہلے سے https ہے (جیسے ایڈمن میں اپلوڈ کے وقت آتا ہے)
  if (src.startsWith('http')) return src;

  const endpoint = "https://ik.imagekit.io/ag0dicbdub";
  
  // شروع کا سلیش ہٹانا تاکہ یو آر ایل ڈبل نہ ہو جائے
  const path = src.startsWith('/') ? src.substring(1) : src;
  
  // کوالٹی اور وڈتھ سیٹ کرنا
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  
  return `${endpoint}/${path}?tr=${paramsString}`;
}