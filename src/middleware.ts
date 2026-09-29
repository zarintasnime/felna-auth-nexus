import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-token";
import { ROLES } from "@/lib/constants/roles";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // 1. Protected routes for any authenticated user: /dashboard and /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protected routes strictly for ADMIN role: /admin and /admin/*
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== ROLES.ADMIN) {
      // Redirect regular users to 403 Forbidden page
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  // 3. Redirect already authenticated users away from public auth pages
  if ((pathname === "/login" || pathname === "/register") && session) {
    if (session.role === ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
// test
