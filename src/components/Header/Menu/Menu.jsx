import prisma from "@/lib/prisma";
import MenuClient from './MenuClient';

export default async function Menu() {
  try {
    // ڈیٹا بیس سے کیٹیگریز لائیں
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return <MenuClient categories={categories} />;
  } catch (error) {
    console.error("Prisma Fetch Error:", error);
    // اگر ایرر آئے تو خالی مینو دکھائیں تاکہ سائٹ کریش نہ ہو
    return <MenuClient categories={[]} />;
  }
}