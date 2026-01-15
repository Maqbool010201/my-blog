// src/app/api/posts/trending/route.js
export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    
    const allPosts = await res.json();
    
    // Get trending posts (most recent published posts)
    const trendingPosts = allPosts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4); // 4 trending posts
    
    return new Response(JSON.stringify(trendingPosts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}