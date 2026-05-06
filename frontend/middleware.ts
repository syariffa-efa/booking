import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isLoginPage = req.nextUrl.pathname === "/login";
  const isPublicAsset =
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/favicon.ico");

  // kalau belum login dan bukan halaman login → paksa ke login
  if (!token && !isLoginPage && !isPublicAsset) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}