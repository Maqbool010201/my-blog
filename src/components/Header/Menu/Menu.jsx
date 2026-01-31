import prisma from "@/lib/prisma";
import MenuClient from './MenuClient';
import { unstable_cache } from 'next/cache';

// ڈیٹا کو کیش کریں تاکہ ہر بار ڈیٹا بیس پر بوجھ نہ پڑے
const getCachedCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  },
  ['menu-categories'],
  { revalidate: 3600 } // 1 گھنٹے بعد ڈیٹا تازہ ہوگا
);

export default async function Menu() {
  try {
    const categories = await getCachedCategories();
    return <MenuClient categories={categories} />;
  } catch (error) {
    return <MenuClient categories={[]} />;
  }
}