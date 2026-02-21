import prisma from "@/lib/prisma";
import MenuClient from "./MenuClient";
import { unstable_cache } from "next/cache";
import { DEFAULT_SITE_ID } from "@/lib/site";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function getCachedCategories(siteId) {
  return unstable_cache(
    async () =>
      prisma.category.findMany({
        where: { siteId },
        orderBy: { name: "asc" },
      }),
    ["menu-categories", siteId],
    { revalidate: 3600, tags: [`menu-categories-${siteId}`] }
  )();
}

function getCachedSettings(siteId) {
  return unstable_cache(
    async () => {
      const delegate = prisma?.siteSetting;
      if (!delegate) return null;
      return delegate.findUnique({ where: { siteId } });
    },
    ["menu-site-settings", siteId],
    { revalidate: 3600, tags: [`menu-settings-${siteId}`] }
  )();
}

export default async function Menu() {
  const [categoriesResult, brandingResult, sessionResult] = await Promise.allSettled([
    getCachedCategories(DEFAULT_SITE_ID),
    getCachedSettings(DEFAULT_SITE_ID),
    getServerSession(authOptions),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const branding = brandingResult.status === "fulfilled" ? brandingResult.value : null;
  const isAuthenticated = sessionResult.status === "fulfilled" ? Boolean(sessionResult.value) : false;

  return <MenuClient categories={categories} branding={branding} isAuthenticated={isAuthenticated} />;
}
