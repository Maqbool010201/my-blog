import { NextResponse } from "next/server";
import ImageKit from "imagekit";

// ImageKit کنفیگریشن
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    // فائل کو بفر میں تبدیل کریں
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // امیج کٹ پر اپلوڈ کریں
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: filename,
      folder: "uploads", // یہ امیج کٹ میں خود بخود فولڈر بنا دے گا
    });

    // ہم 'filePath' واپس کر رہے ہیں تاکہ ڈیٹا بیس میں 'uploads/filename.jpg' سیو ہو
    return NextResponse.json({ 
      success: true,
      url: uploadResponse.url, 
      filePath: uploadResponse.filePath 
    }, { status: 200 });

  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    return NextResponse.json({ error: "Upload failed to cloud" }, { status: 500 });
  }
}