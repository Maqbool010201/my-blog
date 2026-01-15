import slugify from "slugify";
import prisma from "@/lib/prisma";

/* ----------------------------- CONFIG ----------------------------- */
export const dynamic = "auto";
export const revalidate = 60;

/* ----------------------------- GET POSTS (PUBLIC / ADMIN) ----------------------------- */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get("admin") === "true"; // show all for admin
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const where = admin ? {} : { published: true }; // admin sees all posts

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true } }
        }
      }),
      prisma.post.count({ where })
    ]);

    return Response.json({
      posts,
      total,
      totalPages: Math.ceil(total / limit),
      page
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

/* ----------------------------- CREATE POST ----------------------------- */
export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.title?.trim()) return Response.json({ error: "Title required" }, { status: 400 });
    if (!data.categoryId) return Response.json({ error: "Category required" }, { status: 400 });

    const slug = data.slug?.trim() || slugify(data.title, { lower: true, strict: true });
    const exists = await prisma.post.findUnique({ where: { slug } });
    if (exists) return Response.json({ error: "Post slug exists" }, { status: 400 });

    const admin = await prisma.admin.findFirst();
    if (!admin) return Response.json({ error: "Admin not found" }, { status: 500 });

    const post = await prisma.post.create({
      data: {
        title: data.title.trim(),
        slug,
        shortDesc: data.shortDesc || null,
        content: data.content || "",
        metaTitle: data.metaTitle || data.title,
        metaDesc: data.metaDesc || data.shortDesc || null,
        ogTitle: data.ogTitle || data.title,
        ogDesc: data.ogDesc || data.shortDesc || null,
        ogImage: data.ogImage || data.mainImage || null,
        mainImage: data.mainImage || null,
        canonical: data.canonical || `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
        published: Boolean(data.published),
        featured: Boolean(data.featured),
        categoryId: Number(data.categoryId),
        authorId: admin.id
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } }
      }
    });

    return Response.json({ message: "Post created successfully", post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}

/* ----------------------------- PATCH POST ----------------------------- */
export async function PATCH(req, { params }) {
  try {
    const { slug } = params;
    const data = await req.json();

    const parseBoolean = (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value.toLowerCase() === "true";
      return false;
    };

    const updatedData = {
      ...data,
      published: data.published !== undefined ? parseBoolean(data.published) : undefined,
      featured: data.featured !== undefined ? parseBoolean(data.featured) : undefined
    };

    // Remove undefined to avoid overwriting fields accidentally
    Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

    const post = await prisma.post.update({
      where: { slug },
      data: updatedData
    });

    return Response.json({ message: "Post updated", post });
  } catch (error) {
    console.error("PATCH /api/posts error:", error);
    return Response.json({ error: "Failed to update post" }, { status: 500 });
  }
}


/* ----------------------------- DELETE POST ----------------------------- */
export async function DELETE(req, { params }) {
  try {
    const { slug } = params;

    await prisma.post.delete({ where: { slug } });
    return Response.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/posts error:", error);
    return Response.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
