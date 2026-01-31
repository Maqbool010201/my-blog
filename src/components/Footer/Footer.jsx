import Link from 'next/link';
import FooterSocialIcons from './FooterSocialIcons';

export default async function Footer() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let legalPages = [];
  let categories = [];
  let socialLinks = [];

  try {
    // ہم نے cache: 'no-store' ہٹا کر revalidate لگایا ہے تاکہ سرور تیز ہو
    const [legalRes, catRes, socialRes] = await Promise.all([
      fetch(`${baseUrl}/api/legal-pages?siteId=wisemix`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${baseUrl}/api/categories?siteId=wisemix`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${baseUrl}/api/admin/social-links?siteId=wisemix`, { next: { revalidate: 3600 } }).catch(() => null),
    ]);

    if (legalRes?.ok) legalPages = (await legalRes.json()).slice(0, 10);
    if (catRes?.ok) categories = (await catRes.json()).slice(0, 10);
    if (socialRes?.ok) {
        const data = await socialRes.json();
        socialLinks = data?.links || (Array.isArray(data) ? data : []);
    }

  } catch (error) {
    console.error('Footer data fetch error:', error);
  }

  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0b1221] text-white py-12 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Wisemix Media
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
              Your premier destination for diverse insights and trending stories.
            </p>
            <div className="flex items-center">
              <FooterSocialIcons links={socialLinks} />
            </div>
          </div>
          {/* ... Rest of your navigation code remains same ... */}
          <nav className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-5">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </nav>
          {/* ... legal and categories maps ... */}
        </div>
      </div>
    </footer>
  );
}