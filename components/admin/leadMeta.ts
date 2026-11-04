import type { Lead, LeadStatus } from "@/lib/leads";

export const STATUS_META: Record<LeadStatus, { label: string; chip: string; dot: string }> = {
  new: { label: "New", chip: "bg-sky-400/10 text-sky-300 ring-sky-400/30", dot: "bg-sky-400" },
  contacted: { label: "Contacted", chip: "bg-amber-400/10 text-amber-300 ring-amber-400/30", dot: "bg-amber-400" },
  proposal: { label: "Proposal", chip: "bg-violet-400/10 text-violet-300 ring-violet-400/30", dot: "bg-violet-400" },
  won: { label: "Won", chip: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30", dot: "bg-emerald-400" },
  lost: { label: "Lost", chip: "bg-rose-400/10 text-rose-300 ring-rose-400/30", dot: "bg-rose-400" },
};

export const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "proposal", "won", "lost"];

export const SOURCE_LABEL: Record<Lead["source"], string> = { form: "Contact form", "ai-chat": "Ask AI", account: "Client account" };

export function timeAgo(iso: string) {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function fullDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function initials(name: string) {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/** Digits only, for wa.me links. Pakistani numbers starting with 0 get the 92 country code. */
export function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
}

export function leadsToCsv(leads: Lead[]) {
  const cols: [string, (l: Lead) => string][] = [
    ["Received", (l) => l.createdAt],
    ["Name", (l) => l.name],
    ["Email", (l) => l.email],
    ["Phone", (l) => l.phone],
    ["Company", (l) => l.company],
    ["Service", (l) => l.service],
    ["Timeline", (l) => l.timeline],
    ["Status", (l) => STATUS_META[l.status].label],
    ["Source", (l) => SOURCE_LABEL[l.source]],
    ["Page", (l) => l.sourcePage],
    ["Message", (l) => l.message],
    ["Notes", (l) => l.notes.map((n) => n.text).join(" | ")],
  ];
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.map(([h]) => esc(h)).join(","), ...leads.map((l) => cols.map(([, f]) => esc(f(l))).join(","))].join("\r\n");
}
