import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const TOKEN_NAME = "ginga_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_NAME)?.value;
  const isAuthPage = pathname === "/login" || pathname === "/cadastro";
  const isDashboard = pathname === "/";
  const isPublicRoute = pathname.startsWith("/orcamento/");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/cadastro", "/orcamento/:path*"],
};
