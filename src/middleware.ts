import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/signing", "/about", "/public"]; // Add public paths here
const SECRET_KEY = process.env.JWT_SECRET!; // Replace with your secret

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  // If no token, redirect to sign-in page
  if (token == "" || token == null || token == undefined) {
    return NextResponse.redirect(new URL("/signing?reload=true", request.url), 303);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/pos/:path*",
    "/settings/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/inventory/:path*",
  ], // Match all routes except static files
};
