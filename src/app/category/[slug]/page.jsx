import Link from "next/link";
import { notFound } from "next/navigation";
import Advertisement from "@/components/Advertisement/Advertisement";
import IKImage from "@/components/IKImage"; // امیج کٹ کلائنٹ کمپوننٹ

/* ---------------------------------------------
   Optimized Image (Now using ImageKit)
---------------------------------------------- */
const OptimizedImage = ({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "",
}) => (
  // ہم نے عام Image کو IKImage سے بدل دیا ہے تاکہ کسٹم لوڈر کا ایرر نہ آئے
  <IKImage
    src={src || "/images/blog/placeholder.jpg"}
    alt={alt}
    fill
    priority={priority}
    sizes={sizes}
    quality={60}
    className={`object-cover ${className}`}
  />
);

/* ---------------------------------------------
   Fetch Category Data (ISR)
---------------------------------------------- */
async function getCategoryData(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/posts/category/${slug}`, {
      cache: "force-cache",
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? data : null;
  } catch (err) {
    console.error("Category fetch error:", err);
    return null;
  }
}

/* ---------------------------------------------
   Category Page Component
---------------------------------------------- */
export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const categoryData = await getCategoryData(slug);
  if (!categoryData || !categoryData.category) {
    notFound();
  }

  const { category, posts = [], count = 0 } = categoryData;

  // Ads Fetching Logic
  let adsByPosition = {};
  try {
    const adRes = await fetch(
      `${siteUrl}/api/advertisements?pageType=category&isActive=true`,
      { next: { revalidate: 60 } }
    );
    const ads = await adRes.json();
    ads.forEach((a) => {
      const key = a.position.toLowerCase().trim().replace(/\s+/g, "-");
      adsByPosition[key] = a;
    });
  } catch (err) {
    console.error("Category Ad Fetch Error:", err);
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": category.name, "item": `${siteUrl}/category/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b shadow-sm h-16 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex justify-between items-center">
            <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="font-medium text-gray-900">{category.name}</span>
            </nav>
            <div className="hidden sm:block text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
              {count} articles
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <section className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">{category.description}</p>
            )}
          </section>

          {/* TOP AD */}
          {adsByPosition["content-top"] && (
            <div className="mb-8 flex justify-center">
              <Advertisement 
                page="category" 
                position="content-top" 
                adData={adsByPosition["content-top"]} 
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    <OptimizedImage
                      src={post.mainImage}
                      alt={post.title}
                      priority={index === 0} // پہلے آرٹیکل کی امیج کو جلدی لوڈ کریں
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-lg line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* BOTTOM AD */}
          {adsByPosition["content-bottom"] && (
            <div className="mt-12 flex justify-center">
              <Advertisement 
                page="category" 
                position="content-bottom" 
                adData={adsByPosition["content-bottom"]} 
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}