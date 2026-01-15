export default function imageKitLoader({ src, width, quality }) {
  // اینڈ پوائنٹ کے آخر میں سلیش نہ لگائیں
  const endpoint = "https://ik.imagekit.io/ag0dicbdub"; 

  if (src.startsWith('/images/')) return src;

  // یہ لائن بہت اہم ہے: یہ کسی بھی قسم کے فالتو راستے (جیسے /blog/ یا /) کو ہٹا دے گی
  // صرف وہی پاتھ رکھے گی جو ڈیٹا بیس میں ہے (مثلاً uploads/abc.png)
  const cleanSrc = src.split('/').filter(p => p === 'uploads' || p.includes('.')).join('/');
  
  const params = [`w-${width}`];
  if (quality) params.push(`q-${quality}`);
  
  // فائنل لنک چیک کریں: https://ik.imagekit.io/ag0dicbdub/uploads/filename.png
  return `${endpoint}/${cleanSrc}?tr=${params.join(",")}`;
}