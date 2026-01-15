// src/app/admin/create/page.jsx
"use client";

import { Suspense } from "react";
import CreateAdminForm from "./CreateAdminForm";

export default function CreateAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center py-8">Loading...</div>
        </div>
      }>
        <CreateAdminForm />
      </Suspense>
    </div>
  );
}