"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  Wrench,
  CalendarClock,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  ErrorBanner,
  Input,
  Label,
  Modal,
  Textarea,
} from "@/src/components/ui";

export type ClientRow = {
  id: string;
  name: string;
  email: string;
  serviceDetails: string;
  createdAt: string;
};

type FormState = {
  name: string;
  email: string;
  tempPassword: string;
  serviceDetails: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  tempPassword: "",
  serviceDetails: '{\n  "services": ["Website", "CRM", "Appointment Setting"]\n}',
};

function servicesCount(json: string): number {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed.services)) return parsed.services.length;
    return Object.keys(parsed).length;
  } catch {
    return 0;
  }
}

export default function AdminPanel({
  adminName,
  initialClients,
}: {
  adminName: string;
  initialClients: ClientRow[];
}) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const total = clients.length;
    const provisioned = clients.reduce(
      (n, c) => n + servicesCount(c.serviceDetails),
      0,
    );
    const newest = clients[0]
      ? new Date(clients[0].createdAt).toLocaleDateString()
      : "—";
    return { total, provisioned, newest };
  }, [clients]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  }

  function openEdit(client: ClientRow) {
    setEditing(client);
    setForm({
      name: client.name,
      email: client.email,
      tempPassword: "",
      serviceDetails: client.serviceDetails,
    });
    setError("");
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const isEdit = editing !== null;
      const payload: Record<string, string> = {
        name: form.name,
        email: form.email,
        serviceDetails: form.serviceDetails,
      };
      if (!isEdit || form.tempPassword) {
        payload.tempPassword = form.tempPassword;
      }
      const res = await fetch(
        isEdit ? `/api/admin/clients/${editing.id}` : "/api/admin/clients",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }
      if (isEdit) {
        setClients((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...data.client } : c)),
        );
      } else {
        setClients((prev) => [data.client, ...prev]);
      }
      setModalOpen(false);
    } catch {
      setError("Network error — try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(client: ClientRow) {
    if (
      !window.confirm(
        `Revoke access for ${client.name} (${client.email})? This deletes their account.`,
      )
    ) {
      return;
    }
    setDeletingId(client.id);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.id !== client.id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" aria-hidden />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-xs text-zinc-500">Signed in as {adminName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden /> Add New Client
          </Button>
          <Button variant="ghost" onClick={logout} aria-label="Sign out">
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </Button>
        </div>
      </header>

      {/* Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: Users,
            label: "Active Clients",
            value: String(metrics.total),
          },
          {
            icon: Wrench,
            label: "Services Provisioned",
            value: String(metrics.provisioned),
          },
          {
            icon: CalendarClock,
            label: "Latest Onboarding",
            value: metrics.newest,
          },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 ring-1 ring-emerald-600/20">
              <Icon className="h-5 w-5 text-emerald-600" aria-hidden />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="text-2xl font-extrabold tabular-nums">
                {value}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Clients table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/50">
              <tr>
                <th className="px-5 py-3 font-bold">Client</th>
                <th className="px-5 py-3 font-bold">Services</th>
                <th className="px-5 py-3 font-bold">Onboarded</th>
                <th className="px-5 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-zinc-500">
                    No clients yet — add your first one.
                  </td>
                </tr>
              )}
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-zinc-500">{c.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone="success">
                      {servicesCount(c.serviceDetails)} provisioned
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        className="px-3 py-1.5"
                        onClick={() => openEdit(c)}
                        aria-label={`Edit ${c.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="px-3 py-1.5"
                        loading={deletingId === c.id}
                        onClick={() => remove(c)}
                        aria-label={`Delete ${c.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.name}` : "Add New Client"}
      >
        <form onSubmit={save} className="space-y-4">
          <ErrorBanner message={error} />
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tiger Roofing & Masonry"
            />
          </div>
          <div>
            <Label htmlFor="c-email">Email</Label>
            <Input
              id="c-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="owner@company.com"
            />
          </div>
          <div>
            <Label htmlFor="c-pass">
              {editing ? "Reset Password (leave blank to keep)" : "Temporary Password"}
            </Label>
            <Input
              id="c-pass"
              type="text"
              required={!editing}
              minLength={12}
              value={form.tempPassword}
              onChange={(e) =>
                setForm({ ...form, tempPassword: e.target.value })
              }
              placeholder="Minimum 12 characters"
            />
          </div>
          <div>
            <Label htmlFor="c-services">Service Details (JSON)</Label>
            <Textarea
              id="c-services"
              rows={5}
              value={form.serviceDetails}
              onChange={(e) =>
                setForm({ ...form, serviceDetails: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save Changes" : "Create Client"}
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
