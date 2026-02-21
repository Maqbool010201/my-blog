"use client";

import dynamic from "next/dynamic";

const SidebarClient = dynamic(() => import("./SidebarClient"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200 mb-3" />
      <div className="h-3 w-48 animate-pulse rounded bg-gray-100 mb-5" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100 mb-3" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
    </div>
  ),
});

export default function SidebarNewsletterSlot({ siteId }) {
  return <SidebarClient siteId={siteId} />;
}
