"use client";
import Image from "next/image";
import imagekitLoader from "@/lib/imagekitLoader";

export default function IKImage({ src, alt, ...props }) {
  if (!src) return <div className="bg-gray-200 w-full h-full" />;

  return (
    <Image
      loader={imagekitLoader} // یہاں ہم نے لوڈر بتا دیا
      src={src}               // یہاں ڈیٹا بیس والا صرف پاتھ جائے گا
      alt={alt || "WiseMix Image"}
      {...props}
    />
  );
}