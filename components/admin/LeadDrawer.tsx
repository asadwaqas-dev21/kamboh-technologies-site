"use client";

import { useEffect, useState } from "react";
import { Briefcase, Building, Calendar, Call, CloseCircle, Global, Note1, Sms, Trash, Whatsapp } from "iconsax-react";
import type { Lead, LeadStatus } from "@/lib/leads";
import type { AdminApi } from "./AdminApp";
import { fullDate, initials, SOURCE_LABEL, STATUS_META, STATUS_ORDER, timeAgo, whatsappNumber } from "./leadMeta";

type Props = {
  lead: Lead;
  api: AdminApi;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onToast: (msg: string) => void;
};

export default function LeadDrawer({ lead, api, onClose, onUpdate, onDelete, onToast }: Props) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<"" | "status" | "note" | "delete">("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const patch = async (body: { status?: LeadStatus; note?: string }, kind: "status" | "note") => {
    setBusy(kind);
    const res = await api<{ lead: Lead }>(`/api/admin/leads/${lead.id}`, { method: "PATCH", body: JSON.stringify(body) });
    setBusy("");
    if (res.ok && res.data.lead) {
      onUpdate(res.data.lead);
      onToast(kind === "status" ? `Moved to ${STATUS_META[res.data.lead.status].label}` : "Note added");
      if (kind === "note") setNote("");
    } else {
      onToast(res.data.error || "Update failed");
    }
  };

  const remove = async () => {
    setBusy("delete");
    const res = await api(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
    setBusy("");
    if (res.ok) onDelete(lead.id);
    else onToast(res.data.error || "Delete failed");
  };

  const wa = whatsappNumber(lead.phone);
  const timeline = [...lead.notes.map((n) => ({ ...n, kind: "note" as const })), ...lead.activity.map((a) => ({ ...a, kind: "activity" as const }))].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <aside role="dialog" aria-modal="true" aria-label={`Lead: ${lead.name}`} className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#0B0F1A] shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-white/[.06] p-5 sm:p-6">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold">{initials(lead.name)}</span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold tracking-tight">{lead.name}</h2>
            <p className="text-sm text-slate-500">{SOURCE_LABEL[lead.source]} · {timeAgo(lead.createdAt)}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white">
            <CloseCircle size={24} color="currentColor" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          {/* Status pipeline */}
          <section>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
            <div className="grid grid-cols-5 gap-1.5">
              {STATUS_ORDER.map((s) => {
                const active = lead.status === s;
                return (
                  <button
                    key={s}
                    disabled={busy !== ""}
                    onClick={() => !active && patch({ status: s }, "status")}
                    className={`rounded-lg px-1 py-2 text-xs font-semibold ring-1 ring-inset transition disabled:cursor-wait ${active ? STATUS_META[s].chip : "text-slate-500 ring-white/10 hover:text-slate-200 hover:ring-white/20"}`}
                  >
                    {STATUS_META[s].label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Quick actions */}
          <section className="flex flex-wrap gap-2">
            {lead.email && (
              <a href={`mailto:${lead.email}?subject=${encodeURIComponent("Your inquiry to Kamboh Technologies")}`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-3.5 py-2 text-sm font-bold hover:brightness-110">
                <Sms size={17} color="currentColor" /> Email
              </a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-white/5">
                <Call size={17} color="currentColor" /> Call
              </a>
            )}
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 px-3.5 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10">
                <Whatsapp size={17} color="currentColor" /> WhatsApp
              </a>
            )}
          </section>

          {/* Details */}
          <section className="grid gap-px overflow-hidden rounded-2xl border border-white/[.07] bg-white/[.06] sm:grid-cols-2">
            <Detail icon={<Sms size={16} color="#64748B" />} label="Email" value={lead.email} href={lead.email ? `mailto:${lead.email}` : ""} />
            <Detail icon={<Call size={16} color="#64748B" />} label="Phone" value={lead.phone} href={lead.phone ? `tel:${lead.phone.replace(/[^\d+]/g, "")}` : ""} />
            <Detail icon={<Building size={16} color="#64748B" />} label="Company" value={lead.company} />
            <Detail icon={<Briefcase size={16} color="#64748B" />} label="Service" value={lead.service} />
            <Detail icon={<Calendar size={16} color="#64748B" />} label="Timeline" value={lead.timeline} />
            <Detail icon={<Global size={16} color="#64748B" />} label="Page" value={lead.sourcePage} />
          </section>

          {lead.message && (
            <section>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Project details</p>
              <p className="whitespace-pre-wrap rounded-2xl border border-white/[.07] bg-white/[.02] p-4 text-sm leading-relaxed text-slate-200">{lead.message}</p>
            </section>
          )}

          {/* Notes */}
          <section>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Add a note</p>
            <div className="rounded-2xl border border-white/10 bg-black/20 focus-within:border-cyan-400/60">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={2000} placeholder="Call summary, budget, next step…" className="block w-full resize-none bg-transparent p-3.5 text-sm outline-none placeholder:text-slate-600" />
              <div className="flex justify-end border-t border-white/[.06] p-2">
                <button disabled={!note.trim() || busy !== ""} onClick={() => patch({ note }, "note")} className="rounded-lg bg-white/[.08] px-3.5 py-1.5 text-sm font-semibold hover:bg-white/[.12] disabled:opacity-40">
                  {busy === "note" ? "Saving…" : "Save note"}
                </button>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Activity</p>
            <ol className="relative space-y-4 border-l border-white/10 pl-5">
              {timeline.map((t) => (
                <li key={t.id} className="relative">
                  <span className={`absolute -left-[27px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-[#0B0F1A] ${t.kind === "note" ? "bg-cyan-400" : "bg-slate-600"}`} />
                  {t.kind === "note" ? (
                    <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[.04] p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300"><Note1 size={13} color="currentColor" /> Note</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">{t.text}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">{t.text}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-600">{fullDate(t.at)}{t.by && t.by !== "system" ? ` · ${t.by}` : ""}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-white/[.06] p-4 sm:px-6">
          <p className="text-xs text-slate-600">Received {fullDate(lead.createdAt)}</p>
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Delete this lead?</span>
              <button onClick={() => setConfirmDelete(false)} className="rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5">Cancel</button>
              <button onClick={remove} disabled={busy !== ""} className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-bold hover:bg-rose-400 disabled:opacity-60">{busy === "delete" ? "Deleting…" : "Delete"}</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-rose-300 hover:bg-rose-400/10">
              <Trash size={16} color="currentColor" /> Delete
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function Detail({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  return (
    <div className="bg-[#0B0F1A] p-3.5">
      <p className="flex items-center gap-1.5 text-xs text-slate-500">{icon}{label}</p>
      {value ? (
        href ? <a href={href} className="mt-1 block truncate text-sm font-medium text-slate-100 hover:text-cyan-300">{value}</a> : <p className="mt-1 truncate text-sm font-medium text-slate-100">{value}</p>
      ) : (
        <p className="mt-1 text-sm text-slate-600">—</p>
      )}
    </div>
  );
}
