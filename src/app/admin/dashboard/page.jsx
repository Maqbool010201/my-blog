"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminDashboardClient from "@/app/admin/AdminDashboardClient";

export default function ProtectedDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  return <AdminDashboardClient />;
}
