"use client";
import Image from "next/image";
import imageKitLoader from "@/lib/imagekitLoader";

export default function IKImage(props) {
  return <Image loader={imageKitLoader} {...props} />;
}