import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/db";
import { loginSchema } from "@/src/lib/validate";
import {
  signSession,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/src/lib/auth";
import { checkRateLimit, clearRateLimit } from "@/src/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const limit = checkRateLimit(`login:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Constant-shape failure: same message whether the user exists or not,
  // and bcrypt always runs so timing doesn't leak account existence.
  const hashToCheck =
    user?.passwordHash ??
    "$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpUvW3PkWk0mF0Ff1YyIhWmyGm0y2";
  const valid = await bcrypt.compare(password, hashToCheck);

  if (!user || !valid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  clearRateLimit(`login:${ip}`);

  const token = await signSession({
    sub: user.id,
    role: user.role === "ADMIN" ? "ADMIN" : "CLIENT",
    name: user.name,
    email: user.email,
  });

  const res = NextResponse.json({
    ok: true,
    role: user.role,
    redirectTo: user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard",
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
