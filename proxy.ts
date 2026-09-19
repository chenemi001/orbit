import { NextResponse, type NextRequest } from "next/server";

import { getSessionUserId } from "@/lib/auth/session";

const PROTECTED_PATHS = [
  "/dashboard",
  "/tasks",
  "/projects",
  "/notifications",
  "/team",
  "/analytics",
  "/profile",
  "/settings",
  "/ai",
];

const AUTH_PATHS = ["/login", "/register"];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = matchesPath(pathname, PROTECTED_PATHS);
  const isAuthPage = matchesPath(pathname, AUTH_PATHS);

  if (!isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  const userId = await getSessionUserId();

  if (isProtected && !userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/projects/:path*",
    "/notifications/:path*",
    "/team/:path*",
    "/analytics/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/ai/:path*",
    "/login",
    "/register",
  ],
};
