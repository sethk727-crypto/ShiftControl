import { redirect } from "next/navigation";
import {
  CalendarCheck,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { getSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { Badge, Card } from "@/src/components/ui";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

function parseServices(json: string): {
  services: string[];
  extras: Array<[string, string]>;
} {
  try {
    const parsed = JSON.parse(json);
    const services = Array.isArray(parsed.services)
      ? parsed.services.map(String)
      : [];
    const extras = Object.entries(parsed)
      .filter(([k]) => k !== "services")
      .map(([k, v]): [string, string] => [
        k,
        typeof v === "string" ? v : JSON.stringify(v),
      ]);
    return { services, extras };
  } catch {
    return { services: [], extras: [] };
  }
}

export default async function ClientDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/admin/dashboard");

  // Data is fetched by the session's own user id — never a client-supplied id.
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      name: true,
      email: true,
      serviceDetails: true,
      createdAt: true,
    },
  });
  if (!user) redirect("/login");

  const { services, extras } = parseServices(user.serviceDetails);

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" aria-hidden />
          <span className="text-lg font-extrabold tracking-tight">
            SK <span className="text-emerald-600">ShiftControl</span> Portal
          </span>
        </div>
        <LogoutButton />
      </header>

      <h1 className="mb-1 text-2xl font-extrabold tracking-tight">
        Welcome back, {user.name.split(" ")[0]}.
      </h1>
      <p className="mb-8 text-sm text-zinc-500">
        Your deployment is active. Everything provisioned to your account is
        listed below.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Profile */}
        <Card className="p-5">
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Account
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <UserIcon className="h-4 w-4 text-emerald-600" aria-hidden />
              <span className="font-semibold">{user.name}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-emerald-600" aria-hidden />
              <span>{user.email}</span>
            </li>
            <li className="flex items-center gap-3">
              <CalendarCheck className="h-4 w-4 text-emerald-600" aria-hidden />
              <span>
                Client since {user.createdAt.toLocaleDateString()}
              </span>
            </li>
          </ul>
        </Card>

        {/* Provisioned services */}
        <Card className="p-5">
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Active Services
          </h2>
          {services.length === 0 && extras.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Provisioning in progress — your services will appear here.
            </p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {services.map((s) => (
                  <Badge key={s} tone="success">
                    {s}
                  </Badge>
                ))}
              </div>
              {extras.length > 0 && (
                <dl className="space-y-2 text-sm">
                  {extras.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-4 border-b border-zinc-100 pb-2 last:border-0 dark:border-zinc-800"
                    >
                      <dt className="font-mono text-xs uppercase tracking-wide text-zinc-500">
                        {k}
                      </dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          )}
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Need a change to your deployment? Call{" "}
        <a href="tel:+12674554075" className="font-semibold text-emerald-600">
          (267) 455-4075
        </a>{" "}
        — direct line.
      </p>
    </main>
  );
}
