"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

function Brand({ branding }) {
  const mode = branding?.logoDisplay || "IMAGE_AND_TEXT";
  const siteName = branding?.siteName || "WisemixMedia";
  const logoUrl = resolveImageUrl(branding?.logoUrl);
  const logoAlt = branding?.logoAlt || siteName;
  const logoWidth = Number(branding?.logoWidth) || 180;
  const logoHeight = Number(branding?.logoHeight) || 48;
  const showImage = logoUrl && mode !== "TEXT_ONLY";
  const showText = mode !== "IMAGE_ONLY";

  return (
    <Link href="/" className="flex items-center gap-2">
      {showImage ? (
        <img
          src={logoUrl}
          alt={logoAlt}
          style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
          className="object-contain"
        />
      ) : (
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-900 text-white font-bold text-lg">
          {siteName.charAt(0).toUpperCase()}
        </span>
      )}
      {showText && (
        <span className="font-semibold text-lg md:text-xl text-gray-900">
          {siteName}
        </span>
      )}
    </Link>
  );
}

export default function MenuClient({ categories, branding, isAuthenticated = false }) {
  const [open, setOpen] = useState(false);
  const [brandTapCount, setBrandTapCount] = useState(0);
  const [brandTapStartedAt, setBrandTapStartedAt] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
    setOpen(false);
  }

  function handleBrandAccess() {
    const now = Date.now();
    const withinWindow = brandTapStartedAt && now - brandTapStartedAt < 2000;
    const nextCount = withinWindow ? brandTapCount + 1 : 1;
    const nextStart = withinWindow ? brandTapStartedAt : now;

    if (nextCount >= 5) {
      setBrandTapCount(0);
      setBrandTapStartedAt(0);
      router.push("/admin/login");
      return;
    }

    setBrandTapCount(nextCount);
    setBrandTapStartedAt(nextStart);
  }

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div onClick={handleBrandAccess} className="cursor-pointer">
          <Brand branding={branding} />
        </div>

        <ul className="hidden lg:flex gap-8 text-sm font-medium text-gray-700">
          <li>
            <Link href="/" className={pathname === "/" ? "text-gray-900 font-semibold" : "hover:text-gray-900"}>
              Home
            </Link>
          </li>

          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                className={
                  pathname === `/category/${cat.slug}`
                    ? "capitalize text-gray-900 font-semibold"
                    : "capitalize hover:text-gray-900"
                }
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center ml-4 gap-2">
          <form action="/" method="get" className="flex items-center">
            <input type="hidden" name="page" value="1" />
            <input
              type="search"
              name="q"
              placeholder="Search posts..."
              className="w-56 h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="ml-2 h-9 px-3 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Search
            </button>
          </form>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="h-9 px-4 inline-flex items-center rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition"
            >
              Logout
            </button>
          ) : null}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5"
          aria-label="Toggle Menu"
        >
          <span className={`w-6 h-0.5 bg-gray-900 transition ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`w-6 h-0.5 bg-gray-900 transition ${open ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-gray-900 transition ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      <div
        className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="px-4 py-3 flex flex-col gap-3 text-sm font-medium text-gray-700">
          <li>
            <form action="/" method="get" className="flex gap-2">
              <input type="hidden" name="page" value="1" />
              <input
                type="search"
                name="q"
                placeholder="Search posts..."
                className="flex-1 h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="h-9 px-3 rounded-lg bg-gray-900 text-white text-sm">
                Go
              </button>
            </form>
          </li>
          <li>
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link href={`/category/${cat.slug}`} onClick={() => setOpen(false)} className="capitalize">
                {cat.name}
              </Link>
            </li>
          ))}
          {isAuthenticated ? (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center w-full h-10 rounded-lg bg-rose-600 text-white font-semibold"
              >
                Logout
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
}
