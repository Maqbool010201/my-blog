// src/app/api/posts/latest/route.js
import prisma from "@/lib/prisma";

const DEFAULT_LIMIT = 6; // hardcode 6 posts per page

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = DEFAULT_LIMIT; // always 6
    const excludeFeatured = searchParams.get('excludeFeatured') === 'true';
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      published: true,
      ...(excludeFeatured && { featured: false })
    };

    const posts = await prisma.post.findMany({
      where,
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const totalPosts = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalPosts / limit);

    return new Response(JSON.stringify({
      posts,
      pagination: {
        currentPage: page,
        totalPosts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch posts',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
