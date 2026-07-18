import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import AdminPanel, { type ClientRow } from "./panel";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Defense in depth: middleware already guards /admin/*, verify again here.
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    select: {
      id: true,
      name: true,
      email: true,
      serviceDetails: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const rows: ClientRow[] = clients.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return <AdminPanel adminName={session.name} initialClients={rows} />;
}
