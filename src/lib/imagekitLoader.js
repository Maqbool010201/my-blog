export default function imagekitLoader({ src, width, quality }) {
  if (!src) return "";

  const endpoint = "https://ik.imagekit.io/ag0dicbdub";
  
  // 1. اگر src میں پہلے سے مکمل لنک ہے
  if (src.toString().startsWith('http')) {
    const baseUrl = src.split('?')[0];
    return `${baseUrl}?tr=w-${width},q-${quality || 75}`;
  }

  // 2. اہم: پاتھ کو ویسے ہی رہنے دیں جیسا ڈیٹا بیس میں ہے، بس شروع کا سلیش صاف کریں
  // ڈیٹا بیس میں پاتھ ہے: /maqbool-cms/wisemix/posts/image.png
  const cleanPath = src.toString().replace(/^\/+/, '');
  
  // اب یہ بنے گا: https://ik.imagekit.io/ag0dicbdub/maqbool-cms/wisemix/posts/image.png
  return `${endpoint}/${cleanPath}?tr=w-${width},q-${quality || 75}`;
}