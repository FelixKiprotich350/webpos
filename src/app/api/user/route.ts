import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/jwt";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.split("authToken=")[1]?.split(";")[0];

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json(decoded);
}
