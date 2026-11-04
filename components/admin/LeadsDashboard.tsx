"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight2, Cup, DocumentDownload, Element3, Global, HambergerMenu, Logout, MessageText, Profile, Profile2User,
  Refresh2, SearchNormal1, Sms, Timer1,
} from "iconsax-react";
import type { Lead, LeadStatus } from "@/lib/leads";
import type { AdminApi } from "./AdminApp";
import LeadDrawer from "./LeadDrawer";
import { initials, leadsToCsv, SOURCE_LABEL, STATUS_META, STATUS_ORDER, timeAgo } from "./leadMeta";

type Props = { email: string; api: AdminApi; onSignOut: () => void };
type Tab = "all" | LeadStatus;

export default function LeadsDashboard({ email, api, onSignOut }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [service, setService] = useState("all");
  const [source, setSource] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await api<{ leads: Lead[] }>("/api/admin/leads");
    if (res.ok) setLeads(res.data.leads || []);
    else setError(res.data.error || "Could not load leads.");
    setLoading(false);
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: leads.length, new: 0, contacted: 0, proposal: 0, won: 0, lost: 0 };
    leads.forEach((l) => c[l.status]++);
    return c;
  }, [leads]);

  const weekNew = useMemo(() => leads.filter((l) => Date.now() - new Date(l.createdAt).getTime() < 7 * 86400_000).length, [leads]);
  const services = useMemo(() => Array.from(new Set(leads.map((l) => l.service).filter(Boolean))).sort(), [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (tab === "all" || l.status === tab) &&
        (service === "all" || l.service === service) &&
        (source === "all" || l.source === source) &&
        (!q || [l.name, l.email, l.phone, l.company, l.service, l.message].some((v) => v.toLowerCase().includes(q))),
    );
  }, [leads, tab, service, source, query]);

  const selected = leads.find((l) => l.id === selectedId) || null;
  const replaceLead = (lead: Lead) => setLeads((all) => all.map((l) => (l.id === lead.id ? lead : l)));
  const removeLead = (id: string) => {
    setLeads((all) => all.filter((l) => l.id !== id));
    setSelectedId(null);
    setToast("Lead deleted");
  };

  const exportCsv = () => {
    const blob = new Blob(["﻿" + leadsToCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kamboh-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setToast(`Exported ${filtered.length} lead${filtered.length === 1 ? "" : "s"}`);
  };

  const inProgress = counts.contacted + counts.proposal;
  const closed = counts.won + counts.lost;
  const winRate = closed ? Math.round((counts.won / closed) * 100) : 0;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[.06] bg-[#0A0D16] transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white">
            <img src="/logo.png" alt="" width={28} height={31} />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-extrabold tracking-[.06em]">KAMBOH</p>
            <p className="text-[9px] font-semibold tracking-[.38em] text-slate-500">ADMIN PANEL</p>
          </div>
        </div>
        <nav className="mt-2 flex-1 space-y-1 px-3">
          <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[.14em] text-slate-600">Workspace</p>
          <button className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500/15 to-violet-500/10 px-3 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-blue-400/20">
            <Profile2User size={19} color="#60A5FA" variant="Bulk" />
            Leads
            <span className="ml-auto rounded-full bg-sky-400/15 px-2 py-0.5 text-xs text-sky-300">{counts.new}</span>
          </button>
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/[.04] hover:text-white">
            <Global size={19} color="currentColor" />
            View website
          </a>
        </nav>
        <div className="border-t border-white/[.06] p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-bold">{initials(email.split("@")[0])}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{email.split("@")[0]}</p>
              <p className="truncate text-xs text-slate-500">{email}</p>
            </div>
            <button onClick={onSignOut} aria-label="Sign out" title="Sign out" className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-rose-300">
              <Logout size={18} color="currentColor" />
            </button>
          </div>
        </div>
      </aside>
      {menuOpen && <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}

      {/* Main */}
      <main className="min-w-0 flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/[.06] bg-[#07090E]/85 px-4 py-4 backdrop-blur sm:px-8">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden">
            <HambergerMenu size={22} color="currentColor" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Leads</h1>
            <p className="hidden text-sm text-slate-500 sm:block">Every inquiry from the contact form and Ask AI.</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={load} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-3.5 text-sm font-semibold text-slate-300 hover:border-white/20 hover:bg-white/[.04] disabled:opacity-50">
              <Refresh2 size={17} color="currentColor" className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={exportCsv} disabled={!filtered.length} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-3.5 text-sm font-bold shadow-lg shadow-indigo-500/25 hover:brightness-110 disabled:opacity-40">
              <DocumentDownload size={17} color="currentColor" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </header>

        <div className="space-y-6 px-4 py-6 sm:px-8">
          {/* Stats */}
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Stat icon={<Element3 size={20} color="#60A5FA" variant="Bulk" />} label="Total leads" value={counts.all} hint={`${weekNew} in the last 7 days`} />
            <Stat icon={<Sms size={20} color="#38BDF8" variant="Bulk" />} label="New, not contacted" value={counts.new} hint="Reply within a day" accent="sky" />
            <Stat icon={<Timer1 size={20} color="#FBBF24" variant="Bulk" />} label="In progress" value={inProgress} hint={`${counts.contacted} contacted · ${counts.proposal} proposal`} accent="amber" />
            <Stat icon={<Cup size={20} color="#34D399" variant="Bulk" />} label="Won" value={counts.won} hint={closed ? `${winRate}% win rate` : "No closed leads yet"} accent="emerald" />
          </section>

          {/* Table card */}
          <section className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#0C111D]">
            <div className="flex gap-1 overflow-x-auto border-b border-white/[.06] px-3 pt-3 [scrollbar-width:none]">
              {(["all", ...STATUS_ORDER] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex flex-none items-center gap-2 rounded-t-lg border-b-2 px-3.5 pb-3 pt-1.5 text-sm font-semibold transition ${tab === t ? "border-cyan-400 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                  {t !== "all" && <span className={`h-2 w-2 rounded-full ${STATUS_META[t].dot}`} />}
                  {t === "all" ? "All" : STATUS_META[t].label}
                  <span className="rounded-md bg-white/[.06] px-1.5 text-xs text-slate-400">{counts[t]}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-b border-white/[.06] p-4 md:flex-row md:items-center">
              <div className="flex h-10 flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-black/20 px-3 focus-within:border-cyan-400/70">
                <SearchNormal1 size={17} color="#64748B" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone, company or message…" className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-600" />
              </div>
              <div className="flex gap-3">
                <select value={service} onChange={(e) => setService(e.target.value)} className="h-10 flex-1 rounded-xl border border-white/10 bg-[#0C111D] px-3 text-sm text-slate-300 outline-none focus:border-cyan-400/70 md:w-52">
                  <option value="all">All services</option>
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={source} onChange={(e) => setSource(e.target.value)} className="h-10 flex-1 rounded-xl border border-white/10 bg-[#0C111D] px-3 text-sm text-slate-300 outline-none focus:border-cyan-400/70 md:w-40">
                  <option value="all">All sources</option>
                  <option value="form">Contact form</option>
                  <option value="ai-chat">Ask AI</option>
                  <option value="account">Client account</option>
                </select>
              </div>
            </div>

            {error ? (
              <div className="p-10 text-center">
                <p className="font-semibold text-rose-300">{error}</p>
                <button onClick={load} className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">Try again</button>
              </div>
            ) : loading && !leads.length ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[.03]" />)}
              </div>
            ) : !filtered.length ? (
              <div className="px-6 py-16 text-center">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/[.04]"><Profile2User size={26} color="#64748B" /></span>
                <p className="font-semibold">{leads.length ? "No leads match these filters" : "No leads yet"}</p>
                <p className="mt-1 text-sm text-slate-500">{leads.length ? "Try clearing the search or switching tabs." : "New inquiries from the contact form and Ask AI will appear here."}</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <table className="hidden w-full text-left text-sm md:table">
                  <thead className="text-xs uppercase tracking-wider text-slate-500">
                    <tr className="border-b border-white/[.06]">
                      <th className="px-5 py-3 font-semibold">Lead</th>
                      <th className="px-3 py-3 font-semibold">Service</th>
                      <th className="px-3 py-3 font-semibold">Source</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold">Received</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((l) => (
                      <tr key={l.id} onClick={() => setSelectedId(l.id)} className="cursor-pointer border-b border-white/[.04] transition last:border-0 hover:bg-white/[.025]">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 text-xs font-bold ring-1 ring-white/10">{initials(l.name)}</span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-100">{l.name}{l.company && <span className="font-normal text-slate-500"> · {l.company}</span>}</p>
                              <p className="truncate text-xs text-slate-500">{l.email || l.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[220px] truncate px-3 py-3.5 text-slate-300">{l.service || "—"}</td>
                        <td className="px-3 py-3.5"><SourceBadge source={l.source} /></td>
                        <td className="px-3 py-3.5"><StatusChip status={l.status} /></td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-slate-400" title={l.createdAt}>{timeAgo(l.createdAt)}</td>
                        <td className="pr-4 text-slate-600"><ArrowRight2 size={16} color="currentColor" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile cards */}
                <ul className="divide-y divide-white/[.05] md:hidden">
                  {filtered.map((l) => (
                    <li key={l.id}>
                      <button onClick={() => setSelectedId(l.id)} className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-white/[.025]">
                        <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 text-xs font-bold ring-1 ring-white/10">{initials(l.name)}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-semibold">{l.name}</p>
                            <span className="ml-auto flex-none text-xs text-slate-500">{timeAgo(l.createdAt)}</span>
                          </div>
                          <p className="truncate text-sm text-slate-400">{l.service || l.email}</p>
                          <div className="mt-2 flex gap-2"><StatusChip status={l.status} /><SourceBadge source={l.source} /></div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-white/[.06] px-5 py-3 text-xs text-slate-500">Showing {filtered.length} of {leads.length} leads</p>
              </>
            )}
          </section>
        </div>
      </main>

      {selected && <LeadDrawer lead={selected} api={api} onClose={() => setSelectedId(null)} onUpdate={replaceLead} onDelete={removeLead} onToast={setToast} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl border border-white/10 bg-[#141B2D] px-4 py-3 text-sm font-semibold shadow-2xl shadow-black/50">{toast}</div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, hint, accent = "blue" }: { icon: React.ReactNode; label: string; value: number; hint: string; accent?: "blue" | "sky" | "amber" | "emerald" }) {
  const glow = { blue: "from-blue-500/10", sky: "from-sky-400/10", amber: "from-amber-400/10", emerald: "from-emerald-400/10" }[accent];
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/[.07] bg-gradient-to-br ${glow} to-transparent bg-[#0C111D] p-4 sm:p-5`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-[13px] sm:normal-case sm:tracking-normal">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[.04]">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 truncate text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export function StatusChip({ status }: { status: LeadStatus }) {
  const m = STATUS_META[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${m.chip}`}><span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />{m.label}</span>;
}

export function SourceBadge({ source }: { source: Lead["source"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[.04] px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10">
      {source === "ai-chat" ? <MessageText size={13} color="#A78BFA" /> : source === "account" ? <Profile size={13} color="#34D399" /> : <Sms size={13} color="#22D3EE" />}
      {SOURCE_LABEL[source]}
    </span>
  );
}
