import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.siteId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    // 1. فائل سائز اور ٹائپ کی چیکنگ (SaaS کے لیے ضروری)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      return NextResponse.json({ error: "File size exceeds 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // فائل کے نام کو کلین بنانا
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
    const filename = `${Date.now()}-${cleanFileName}`;

    // 2. فولڈر اسٹرکچر: maqbool-cms/SITE_ID/posts
    const folderPath = `maqbool-cms/${session.user.siteId}/posts`;

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: filename,
      folder: folderPath,
      useUniqueFileName: true,
      // اگر آپ امیج کو اپلوڈ ہوتے ہی ری سائز کرنا چاہیں تو یہاں tags یا transformations دے سکتے ہیں
    });

    return NextResponse.json({ 
      success: true,
      url: uploadResponse.url, 
      filePath: uploadResponse.filePath,
      fileId: uploadResponse.fileId // یہ آئی ڈی بعد میں ڈیلیٹ کرنے کے کام آتی ہے
    }, { status: 200 });

  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}