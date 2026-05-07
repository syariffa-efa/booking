import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico");

  // BELUM LOGIN
  if (!token && !isAuthPage && !isPublicAsset) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // SUDAH LOGIN TAPI MASUK LOGIN PAGE
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
