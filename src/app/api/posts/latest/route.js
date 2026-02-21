import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";

const DEFAULT_LIMIT = 6;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId") || DEFAULT_SITE_ID;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = DEFAULT_LIMIT;
    const excludeFeatured = searchParams.get("excludeFeatured") === "true";
    const skip = (page - 1) * limit;

    const where = {
      siteId,
      published: true,
      ...(excludeFeatured && { featured: false }),
    };

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          shortDesc: true,
          mainImage: true,
          featured: true,
          published: true,
          createdAt: true,
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);
    return new Response(
      JSON.stringify({
        posts,
        pagination: {
          currentPage: page,
          totalPosts,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 });
  }
}
