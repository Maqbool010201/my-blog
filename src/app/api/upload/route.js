import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { DEFAULT_SITE_ID } from "@/lib/site";

const VALID_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXTENSION_BY_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export const runtime = "nodejs";

function sanitizeSegment(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "default";
}

function resolveSiteId(session) {
  return DEFAULT_SITE_ID;
}

function normalizeFilename(originalName, mimeType) {
  const originalExt = path.extname(originalName || "").toLowerCase();
  const extension = originalExt || EXTENSION_BY_TYPE[mimeType] || ".bin";
  const basename = path
    .basename(originalName || "upload", originalExt || undefined)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "image";
  return `${Date.now()}-${crypto.randomUUID()}-${basename}${extension}`;
}

async function uploadLocal({ buffer, filename, siteId }) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", siteId, "posts");
  await fs.mkdir(uploadDir, { recursive: true });
  const absolutePath = path.join(uploadDir, filename);
  await fs.writeFile(absolutePath, buffer);
  const publicPath = `/uploads/${siteId}/posts/${filename}`;
  return { url: publicPath, filePath: publicPath };
}

async function uploadImageKit({ file, filename, buffer, siteId, settings }) {
  const publicKey = settings?.imageKitPublicKey || process.env.IMAGEKIT_PUBLIC_KEY || "";
  const privateKey = settings?.imageKitPrivateKey || process.env.IMAGEKIT_PRIVATE_KEY || "";
  const urlEndpoint = settings?.imageKitUrlEndpoint || process.env.IMAGEKIT_URL_ENDPOINT || "";
  const folder = settings?.imageKitFolder || process.env.IMAGEKIT_FOLDER || `${siteId}/posts`;

  if (!privateKey || !urlEndpoint) {
    throw new Error("ImageKit credentials missing. Set them in Site Settings or environment variables.");
  }

  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: file.type }), filename);
  formData.append("fileName", filename);
  formData.append("folder", folder);
  formData.append("useUniqueFileName", "true");

  const auth = Buffer.from(`${privateKey}:`).toString("base64");
  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "ImageKit upload failed");
  }

  return {
    url: data.url,
    filePath: data.filePath || data.url,
    meta: { provider: "IMAGEKIT", fileId: data.fileId, publicKey, urlEndpoint },
  };
}

async function uploadCloudinary({ file, filename, buffer, siteId, settings }) {
  const cloudName = settings?.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME || "";
  const apiKey = settings?.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = settings?.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET || "";
  const folder = settings?.cloudinaryFolder || process.env.CLOUDINARY_FOLDER || `${siteId}/posts`;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials missing. Set them in Site Settings or environment variables.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: file.type }), filename);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const res = await fetch(url, { method: "POST", body: formData });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return {
    url: data.secure_url || data.url,
    filePath: data.public_id || data.secure_url || data.url,
    meta: { provider: "CLOUDINARY", publicId: data.public_id, cloudName },
  };
}

async function getSiteSettings(siteId) {
  const delegate = prisma?.siteSetting;
  if (!delegate) return null;
  try {
    return await delegate.findUnique({
      where: { siteId },
      select: {
        storageProvider: true,
        imageKitPublicKey: true,
        imageKitPrivateKey: true,
        imageKitUrlEndpoint: true,
        imageKitFolder: true,
        cloudinaryCloudName: true,
        cloudinaryApiKey: true,
        cloudinaryApiSecret: true,
        cloudinaryFolder: true,
      },
    });
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const siteId = sanitizeSegment(resolveSiteId(session));
    const filename = normalizeFilename(file.name, file.type);

    const settings = await getSiteSettings(siteId);
    const provider = (settings?.storageProvider || process.env.STORAGE_PROVIDER || "LOCAL").toUpperCase();

    let result;
    if (provider === "IMAGEKIT") {
      result = await uploadImageKit({ file, filename, buffer, siteId, settings });
    } else if (provider === "CLOUDINARY") {
      result = await uploadCloudinary({ file, filename, buffer, siteId, settings });
    } else {
      result = await uploadLocal({ buffer, filename, siteId });
    }

    return NextResponse.json(
      {
        success: true,
        provider,
        url: result.url,
        filePath: result.filePath,
        meta: result.meta || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
