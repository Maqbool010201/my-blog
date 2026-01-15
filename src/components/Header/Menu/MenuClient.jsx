'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function MenuClient({ categories }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-900 text-white font-bold text-lg">
            W
          </span>
          <span className="font-semibold text-lg md:text-xl text-gray-900">
            WisemixMedia
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex gap-8 text-sm font-medium text-gray-700">
          <li>
            <Link
              href="/"
              className={
                pathname === '/'
                  ? 'text-gray-900 font-semibold'
                  : 'hover:text-gray-900'
              }
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/tools"
              className={
                pathname.startsWith('/tools')
                  ? 'text-gray-900 font-semibold'
                  : 'hover:text-gray-900'
              }
            >
              Tools
            </Link>
          </li>

          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                className={
                  pathname === `/category/${cat.slug}`
                    ? 'capitalize text-gray-900 font-semibold'
                    : 'capitalize hover:text-gray-900'
                }
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-6 h-0.5 bg-gray-900 transition ${
              open ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-gray-900 transition ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-gray-900 transition ${
              open ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="px-4 py-3 flex flex-col gap-3 text-sm font-medium text-gray-700">
          <li>
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>

          {/* ✅ TOOLS ADDED */}
          <li>
            <Link href="/tools" onClick={() => setOpen(false)}>
              Tools
            </Link>
          </li>

          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="capitalize"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
