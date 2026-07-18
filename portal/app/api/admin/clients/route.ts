import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/db";
import { requireAdmin } from "@/src/lib/auth";
import { createClientSchema } from "@/src/lib/validate";

const SAFE_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  serviceDetails: true,
  createdAt: true,
} as const;

/** List clients — ADMIN only. */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    select: SAFE_FIELDS,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ clients });
}

/** Create a client account — ADMIN only. Password is bcrypt-hashed. */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = createClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed." },
      { status: 400 },
    );
  }

  const { name, email, tempPassword, serviceDetails } = parsed.data;
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "CLIENT", // role is never caller-controlled
        serviceDetails: serviceDetails || "{}",
      },
      select: SAFE_FIELDS,
    });
    return NextResponse.json({ client: user }, { status: 201 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }
    throw err;
  }
}
