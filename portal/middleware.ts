import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "sk_session";

type Role = "ADMIN" | "CLIENT";

async function readSession(
  req: NextRequest,
): Promise<{ role: Role } | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    if (payload.role !== "ADMIN" && payload.role !== "CLIENT") return null;
    return { role: payload.role };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await readSession(req);

  // /admin/* — strictly ADMIN only
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      const url = new URL("/login", req.url);
      const res = NextResponse.redirect(url);
      // A CLIENT hitting /admin keeps their session; an invalid token is cleared
      if (!session) res.cookies.delete(SESSION_COOKIE);
      return res;
    }
    return NextResponse.next();
  }

  // /dashboard/* — any authenticated user
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }
    return NextResponse.next();
  }

  // /login — bounce authenticated users to their home
  if (pathname === "/login" && session) {
    const home = session.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(home, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
