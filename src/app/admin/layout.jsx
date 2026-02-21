import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";

export async function generateMetadata() {
  let siteName = process.env.NEXT_PUBLIC_BRAND_NAME || "My Blog";

  try {
    const settings = await prisma?.siteSetting?.findUnique({
      where: { siteId: DEFAULT_SITE_ID },
      select: { siteName: true },
    });
    if (settings?.siteName?.trim()) {
      siteName = settings.siteName.trim();
    }
  } catch {
    // keep fallback
  }

  return {
    title: {
      default: `${siteName} Admin`,
      template: `%s | ${siteName} Admin`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function AdminLayout({ children }) {
  return children;
}
