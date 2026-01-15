import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Rate limiter instance
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

// Per–endpoint rate limit rules
const rateLimitConfig = {
  "/api/posts/featured": { limit: 30, window: 60 * 1000 },
  "/api/posts/latest": { limit: 20, window: 60 * 1000 },
  "/api/posts": { limit: 10, window: 60 * 1000 },
  default: { limit: 10, window: 60 * 1000 },
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Handle API routes only
  const isApi = pathname.startsWith("/api/");
  const isAuthRoute =
    pathname.startsWith("/api/auth") || pathname === "/admin/login";

  // Apply rate limiting only on public API endpoints, not auth
  if (isApi && !pathname.startsWith("/api/auth")) {
    // Find matching config
    let config = rateLimitConfig.default;
    for (const [key, val] of Object.entries(rateLimitConfig)) {
      if (pathname.startsWith(key) && key !== "default") {
        config = val;
        break;
      }
    }

    try {
      await limiter.check(request, config.limit, pathname);
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: `Wait ${Math.ceil(config.window / 1000)} seconds.`,
          path: pathname,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(config.window / 1000).toString(),
          },
        }
      );
    }
  }

  const response = NextResponse.next();

  // Security Headers for ALL routes except images/assets
  if (!pathname.startsWith("/_next/") && !pathname.match(/\.(jpg|jpeg|png|gif|webp|ico)$/)) {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
  }

  // CORS only for API routes
  if (isApi) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      });
    }
  }

  // Cache control for static assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|css|js)$/)
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*", // API routes
    "/admin/:path*", // Admin routes
  ],
};
