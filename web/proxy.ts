import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/login",
  "/verify",
  "/api/run-code",
  "/api/auth/verify-dosen-pin",
  "/api/gamification",
  "/api/help",
];

const staticExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
  ".ico",
  ".css",
  ".js",
  ".woff2",
  ".woff",
  ".wasm",
  ".data",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets
  const isStatic = staticExtensions.some((ext) => pathname.endsWith(ext));
  if (isStatic) return NextResponse.next();

  // Allow explicitly public paths (excluding /admin)
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (isPublic && !pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("matrikulasi-auth")?.value;

  // Protect Admin API endpoints
  if (pathname.startsWith("/api/admin")) {
    if (!authCookie || (authCookie !== "dosen_verified" && authCookie !== "true")) {
      return NextResponse.json(
        { error: "Akses ditolak: Autentikasi Admin diperlukan." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect internal pages (/dashboard, /learn, /certificate, /admin)
  if (!authCookie && !pathname.startsWith("/login")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|workers).*)",
  ],
};
