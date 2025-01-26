import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/api/signup",
  "/api/login",
  "/api/logout",
  "/api/token",
  "/signing",
  "/initialsetup", 
];

const STATIC_ASSETS = ["/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  console.log(request.url);
  // Allow static assets
  if (STATIC_ASSETS.some((route) => requestPath.startsWith(route))) {
    return NextResponse.next();
  }

  // Extract token from cookies
  const token = request.cookies.get("authToken")?.value;

  // Check if the route is public
  const isPublicRoute =
    requestPath === "/" ||
    PUBLIC_ROUTES.some((route) => requestPath.startsWith(route));

  // Allow access to public routes or authenticated users
  if (isPublicRoute || token) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  const redirectUrl = new URL("/signing", request.url);
  redirectUrl.searchParams.set("redirect", requestPath);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/api/:path*", "/:path*"], // Ensure middleware matches API and other routes
};
