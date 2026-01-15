import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import ImageKit from "imagekit";

/* ================= ImageKit Config ================= */
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

/* ================= GET SINGLE POST ================= */
export async function GET(req, { params }) {
  try {
    const { slug } = await params; // ✅ REQUIRED IN NEXT 15

    if (!slug) {
      return NextResponse.json(
        { error: "Slug missing in URL" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE POST (PATCH) ================= */
export async function PATCH(req, { params }) {
  try {
    const { slug } = await params; // ✅ REQUIRED
    const data = await req.json();

    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let newSlug = existingPost.slug;

    if (data.slug && data.slug !== slug) {
      newSlug = slugify(data.slug, { lower: true, strict: true });

      const conflict = await prisma.post.findUnique({
        where: { slug: newSlug },
      });

      if (conflict) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title: data.title ?? existingPost.title,
        slug: newSlug,
        shortDesc: data.shortDesc ?? existingPost.shortDesc,
        content: data.content ?? existingPost.content,
        mainImage: data.mainImage ?? existingPost.mainImage,
        ogImage: data.ogImage ?? existingPost.ogImage,
        metaTitle: data.metaTitle ?? existingPost.metaTitle,
        metaDesc: data.metaDesc ?? existingPost.metaDesc,
        categoryId: data.categoryId
          ? Number(data.categoryId)
          : existingPost.categoryId,
        published: data.published ?? existingPost.published,
        featured: data.featured ?? existingPost.featured,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

/* ================= DELETE POST ================= */
export async function DELETE(req, { params }) {
  try {
    const { slug } = await params; // ✅ REQUIRED

    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.mainImage) {
      try {
        const fileName = post.mainImage.split("/").pop();
        const files = await imagekit.listFiles({
          searchQuery: `name = "${fileName}"`,
        });

        if (files.length > 0) {
          await imagekit.deleteFile(files[0].fileId);
        }
      } catch (imgErr) {
        console.error("ImageKit delete error:", imgErr.message);
      }
    }

    await prisma.post.delete({ where: { slug } });

    return NextResponse.json({
      message: "Post and images deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
