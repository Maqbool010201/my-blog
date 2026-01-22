import Image from "next/image";
import imagekitLoader from "@/lib/imagekitLoader";

export default function IKImage({ src, alt, ...props }) {
  if (!src) return <div className="bg-gray-200 w-full h-full" />;

  return (
    <Image
      loader={imagekitLoader} // یہ لائن سب سے اہم ہے
      src={src}
      alt={alt || "WiseMix Media"}
      {...props}
    />
  );
}