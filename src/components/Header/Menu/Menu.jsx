import prisma from "@/lib/prisma";
import MenuClient from './MenuClient';
import { unstable_cache } from 'next/cache';

// ڈیٹا کو کیشے کرنے کے لیے فنکشن
const getCachedCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      where: { siteId: "wisemix" }, // اپنی سائٹ کا ڈیٹا فلٹر کریں
      orderBy: { name: 'asc' },
    });
  },
  ['categories-list'],
  { revalidate: 3600, tags: ['categories'] }
);

export default async function Menu() {
  const categories = await getCachedCategories();
  return <MenuClient categories={categories} />;
}