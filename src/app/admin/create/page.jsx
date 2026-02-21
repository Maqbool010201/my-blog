import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CreateAdminForm from "./CreateAdminForm";

export default async function CreateAdminPage() {
  const adminCount = await prisma.admin.count();

  if (adminCount > 0) {
    redirect("/admin/login?setup=locked");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <CreateAdminForm />
    </div>
  );
}
