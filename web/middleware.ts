import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/api"];
const staticExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico", ".css", ".js", ".woff2", ".woff"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStatic = staticExtensions.some((ext) => pathname.endsWith(ext));
  if (isStatic) return NextResponse.next();

  const isPublic = publicPaths.some((path) => pathname === path || pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  const authCookie = request.cookies.get("matrikulasi-auth")?.value;
  if (!authCookie && !pathname.startsWith("/login")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
