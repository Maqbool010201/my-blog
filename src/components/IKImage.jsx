// src/components/IKImage.jsx
import Image from "next/image";
import imagekitLoader from "@/lib/imagekitLoader";

export default function IKImage({ src, alt, ...props }) {
  // 1. اگر src سرے سے موجود ہی نہیں
  if (!src) {
    return <div className="bg-gray-200 w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>;
  }

  // 2. پاتھ کو کلین کرنا (اگر ڈیٹا بیس میں پورا URL محفوظ ہو گیا ہو)
  let imageSrc = src;
  if (typeof src === "string" && src.startsWith("http")) {
    // اگر یہ پہلے سے ImageKit کا مکمل لنک ہے، تو ہم صرف پاتھ نکال سکتے ہیں یا ڈائریکٹ دے سکتے ہیں
    const parts = src.split(".io/ag0dicbdub/");
    imageSrc = parts.length > 1 ? parts[1] : src;
  }

  return (
    <Image
      loader={imagekitLoader}
      src={imageSrc}
      alt={alt || "WiseMix Media"}
      {...props}
    />
  );
}