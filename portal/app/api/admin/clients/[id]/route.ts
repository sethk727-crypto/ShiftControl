import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/db";
import { requireAdmin } from "@/src/lib/auth";
import { updateClientSchema } from "@/src/lib/validate";

const SAFE_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  serviceDetails: true,
  createdAt: true,
} as const;

type Params = { params: Promise<{ id: string }> };

/** Update a client — ADMIN only. Cannot touch ADMIN accounts or roles. */
export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "CLIENT") {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updateClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed." },
      { status: 400 },
    );
  }

  const { name, email, tempPassword, serviceDetails } = parsed.data;
  const data: Prisma.UserUpdateInput = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (serviceDetails !== undefined) data.serviceDetails = serviceDetails;
  if (tempPassword !== undefined) {
    data.passwordHash = await bcrypt.hash(tempPassword, 12);
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: SAFE_FIELDS,
    });
    return NextResponse.json({ client: updated });
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

/** Delete a client — ADMIN only. ADMIN accounts can never be deleted here. */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "CLIENT") {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
