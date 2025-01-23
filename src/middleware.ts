import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the public routes (accessible without authentication)
const PUBLIC_ROUTES = [
  "/api/signup",
  "/api/login",
  "/api/logout",
  "/api/token",
  "/signing",
  "/about",
  "/contacts",
];

// Exclude static asset paths from authentication check
const STATIC_ASSETS = ["/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;

  // Ignore static asset requests
  if (STATIC_ASSETS.some((route) => requestPath.startsWith(route))) {
    return NextResponse.next(); // Allow static assets
  }

  // Get the auth token from cookies
  const token = request.cookies.get("authToken")?.value; // Use ?.value for Next.js cookie objects

  // Check if the current path is a public route
  const isPublicRoute =
    requestPath === "/" || // Allow exact match for root "/"
    PUBLIC_ROUTES.some((route) => requestPath.startsWith(route)); //allow if public route

  // Allow access to public routes or if the user has a valid token
  if (isPublicRoute || token) {
    return NextResponse.next(); // Allow access
  }

  // If the route is protected and the user is not authenticated, redirect to login
  const redirectUrl = new URL("/signing", request.url);
  redirectUrl.searchParams.set("redirect", request.nextUrl.pathname); // Store the current path
  return NextResponse.redirect(redirectUrl);
}

// Middleware configuration
export const config = {
  matcher: [
    "/:path*", // Match all routes
  ],
};
