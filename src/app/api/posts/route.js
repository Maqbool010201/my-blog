import slugify from "slugify";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ----------------------------- GET POSTS ----------------------------- */
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    
    const adminMode = searchParams.get("admin") === "true";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // --- ملٹی ٹیننٹ لاجک ---
    let where = { published: true };

    if (adminMode && session) {
      // اگر سپر ایڈمن ہے تو سب کچھ دکھاؤ، ورنہ صرف اس کی اپنی سائٹ کا ڈیٹا
      where = session.user.role === "SUPER_ADMIN" 
        ? {} 
        : { siteId: session.user.siteId };
    } else if (searchParams.get("siteId")) {
      // پبلک فرنٹ اینڈ کے لیے مخصوص سائٹ کا ڈیٹا
      where = { siteId: searchParams.get("siteId"), published: true };
    }

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

    return Response.json({ posts, total, totalPages: Math.ceil(total / limit), page });
  } catch (error) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

/* ----------------------------- CREATE POST ----------------------------- */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    if (!data.title?.trim()) return Response.json({ error: "Title required" }, { status: 400 });

    const slug = data.slug?.trim() || slugify(data.title, { lower: true, strict: true });
    
    // --- ملٹی ٹیننٹ چیک: ایک ہی سائٹ پر ڈپلیکیٹ سلگ نہ ہو ---
    const exists = await prisma.post.findFirst({ 
      where: { slug, siteId: session.user.siteId } 
    });
    if (exists) return Response.json({ error: "Slug already exists on your site" }, { status: 400 });

    const post = await prisma.post.create({
      data: {
        title: data.title.trim(),
        slug,
        siteId: session.user.siteId, // سیشن سے سائٹ آئی ڈی لیں
        authorId: session.user.id,    // سیشن سے ایڈمن آئی ڈی لیں
        shortDesc: data.shortDesc || null,
        content: data.content || "",
        metaTitle: data.metaTitle || data.title,
        metaDesc: data.metaDesc || data.shortDesc || null,
        published: Boolean(data.published),
        featured: Boolean(data.featured),
        categoryId: Number(data.categoryId),
        mainImage: data.mainImage || null,
      }
    });

    return Response.json({ message: "Post created", post }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}