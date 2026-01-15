"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminHome from "./DashboardUI"; // your dashboard UI

export default function AdminDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // if loading → show loader
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Checking authentication...
      </div>
    );
  }

  // if not logged in → redirect
  if (!session) {
    router.push("/admin/login");
    return null;
  }

  // authenticated → show dashboard UI
  return <AdminHome />;
}
