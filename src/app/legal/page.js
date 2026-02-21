import Link from "next/link";
import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";

export const revalidate = 3600;

export default async function LegalIndexPage() {
  const pages = await prisma.legalPage.findMany({
    where: { siteId: DEFAULT_SITE_ID, isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, slug: true, title: true, description: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal</h1>
        <p className="text-gray-600 mb-8">Terms, privacy, and policy pages for this website.</p>

        <div className="space-y-3">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/legal/${page.slug}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition"
            >
              <h2 className="font-semibold text-gray-900">{page.title}</h2>
              {page.description ? <p className="text-sm text-gray-600 mt-1">{page.description}</p> : null}
            </Link>
          ))}
          {pages.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-sm text-gray-500">
              No legal pages found.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
