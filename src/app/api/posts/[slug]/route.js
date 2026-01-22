import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import ImageKit from "imagekit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

/* ================= GET SINGLE POST ================= */
export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId"); // فرنٹ اینڈ سے سائٹ آئی ڈی لینا ضروری ہے

    if (!slug || !siteId) {
      return NextResponse.json({ error: "Slug and siteId required" }, { status: 400 });
    }

    // اب ہمیں findFirst استعمال کرنا ہوگا کیونکہ unique انڈیکس دو چیزوں پر مشتمل ہے
    const post = await prisma.post.findFirst({
      where: { slug, siteId },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
      },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

/* ================= UPDATE POST (PATCH) ================= */
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const data = await req.json();

    // اس پوسٹ کو ڈھونڈیں جو اس یوزر کی اپنی سائٹ کی ہو
    const existingPost = await prisma.post.findFirst({
      where: { slug, siteId: session.user.siteId }
    });

    if (!existingPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    let newSlug = existingPost.slug;
    if (data.slug && data.slug !== slug) {
      newSlug = slugify(data.slug, { lower: true, strict: true });
      // چیک کریں کہ نئی سلگ اس سائٹ پر پہلے سے تو نہیں
      const conflict = await prisma.post.findFirst({
        where: { slug: newSlug, siteId: session.user.siteId },
      });
      if (conflict) newSlug = `${newSlug}-${Date.now()}`;
    }

    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id }, // ID سے اپ ڈیٹ کرنا سب سے محفوظ ہے
      data: {
        title: data.title ?? existingPost.title,
        slug: newSlug,
        shortDesc: data.shortDesc ?? existingPost.shortDesc,
        content: data.content ?? existingPost.content,
        mainImage: data.mainImage ?? existingPost.mainImage,
        ogImage: data.ogImage ?? existingPost.ogImage,
        metaTitle: data.metaTitle ?? existingPost.metaTitle,
        metaDesc: data.metaDesc ?? existingPost.metaDesc,
        categoryId: data.categoryId ? Number(data.categoryId) : existingPost.categoryId,
        published: data.published ?? existingPost.published,
        featured: data.featured ?? existingPost.featured,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* ================= DELETE POST ================= */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;

    const post = await prisma.post.findFirst({
      where: { slug, siteId: session.user.siteId }
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // ImageKit سے تصویر ڈیلیٹ کرنا
    if (post.mainImage) {
      try {
        const fileName = post.mainImage.split("/").pop();
        const files = await imagekit.listFiles({ searchQuery: `name = "${fileName}"` });
        if (files.length > 0) await imagekit.deleteFile(files[0].fileId);
      } catch (imgErr) { console.error("ImageKit error:", imgErr.message); }
    }

    await prisma.post.delete({ where: { id: post.id } });

    return NextResponse.json({ message: "Post and images deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}