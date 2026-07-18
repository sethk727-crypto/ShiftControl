import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/auth";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(session.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
}
