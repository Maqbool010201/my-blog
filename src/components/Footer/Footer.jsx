import Link from "next/link";
import FooterSocialIcons from "./FooterSocialIcons";
import FooterHiddenLoginTrigger from "./FooterHiddenLoginTrigger";
import { DEFAULT_SITE_ID } from "@/lib/site";

export default async function Footer() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteId = DEFAULT_SITE_ID;

  let legalPages = [];
  let categories = [];
  let socialLinks = [];

  try {
    const [legalRes, catRes, socialRes] = await Promise.all([
      fetch(`${baseUrl}/api/legal-pages?siteId=${siteId}`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${baseUrl}/api/categories?siteId=${siteId}`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${baseUrl}/api/admin/social-links?siteId=${siteId}`, { next: { revalidate: 3600 } }).catch(() => null),
    ]);

    if (legalRes?.ok) {
      const data = await legalRes.json();
      legalPages = Array.isArray(data) ? data.slice(0, 10) : [];
    }
    if (catRes?.ok) {
      const data = await catRes.json();
      categories = Array.isArray(data) ? data.slice(0, 10) : [];
    }
    if (socialRes?.ok) {
      const data = await socialRes.json();
      socialLinks = data?.links || (Array.isArray(data) ? data : []);
    }
  } catch (error) {
    console.error("Footer data fetch error:", error);
  }

  const year = new Date().getFullYear();
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "My Blog";

  return (
    <footer className="w-full bg-[#0b1221] text-white py-12 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {brandName}
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
              Latest stories, insights, and useful guides.
            </p>
            <div className="flex items-center">
              <FooterSocialIcons links={socialLinks} />
            </div>
          </div>

          <nav className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-5">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </nav>

          <nav className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-5">Legal</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link></li>
              <li><Link href="/robots.txt" className="hover:text-white transition-colors">Robots</Link></li>
              {legalPages.map((page) => (
                <li key={page.id}>
                  <Link href={`/legal/${page.slug}`} className="hover:text-blue-400 transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-5">Categories</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-blue-400 transition-colors capitalize">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
          <FooterHiddenLoginTrigger year={year} brandName={brandName} />
        </div>
      </div>
    </footer>
  );
}
