import prisma from "@/lib/prisma";

const DEFAULT_LIMIT = 6;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 1. یہاں سے ہم siteId حاصل کریں گے
    const siteId = searchParams.get("siteId");
    
    if (!siteId) {
      return new Response(JSON.stringify({ error: 'siteId is required' }), { status: 400 });
    }

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = DEFAULT_LIMIT;
    const excludeFeatured = searchParams.get('excludeFeatured') === 'true';
    const skip = (page - 1) * limit;

    // 2. Build where clause with siteId
    const where = {
      siteId: siteId, // اب یہ صرف اسی مخصوص ویب سائٹ کی پوسٹ لائے گا
      published: true,
      ...(excludeFeatured && { featured: false })
    };

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { 
          category: { select: { id: true, name: true, slug: true } }, 
          author: { select: { id: true, name: true } } 
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

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
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), { status: 500 });
  }
}