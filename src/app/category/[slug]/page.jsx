import Link from "next/link";
import { notFound } from "next/navigation";
import IKImage from "@/components/IKImage";
import prisma from "@/lib/prisma";

async function getCategoryData(slug) {
  try {
    // چونکہ آپ نے بتایا کہ siteId 'wisemix' ہے، ہم اسے یہاں استعمال کریں گے
    const category = await prisma.category.findFirst({
      where: { 
        slug: slug,
        siteId: "wisemix"  // آپ کی DB کی اصل ID
      },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { posts: true } }
      }
    });

    return category;
  } catch (err) {
    console.error("Database fetch error:", err);
    return null;
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryData(slug);

  if (!category) {
    notFound(); // اگر سلگ یا سائٹ آئی ڈی غلط ہوئی تو یہ چلے گا
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b h-16 flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full flex justify-between">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600">Home</Link> / {category.name}
          </nav>
          <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">
            {category._count?.posts || 0} Articles
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-10">{category.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {category.posts?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <div className="relative aspect-video">
                  <IKImage
                    src={post.mainImage || "/images/blog/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-gray-900 group-hover:text-blue-600">
                    {post.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}