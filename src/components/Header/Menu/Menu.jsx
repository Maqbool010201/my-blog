import prisma from "@/lib/prisma";
import MenuClient from './MenuClient';

export default async function Menu() {
  // Fetch categories from the database. 
  // If you have multiple sites, you might need to filter by a specific siteId.
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    // where: { siteId: "your-fixed-site-id-if-needed" } 
  });

  return <MenuClient categories={categories} />;
}