import { PrismaClient } from '@prisma/client';
import MenuClient from './MenuClient';

const prisma = new PrismaClient();

export default async function Menu({ categories }) {
  // No ad fetching here
  return <MenuClient categories={categories} />;
}
