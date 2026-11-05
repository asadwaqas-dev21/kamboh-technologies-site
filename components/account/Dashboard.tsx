"use client";

import { useMemo, useState } from "react";
import { sendPasswordResetEmail, signOut, type User } from "firebase/auth";
import {
  Add, ArrowRight2, Briefcase, Building, Call, Danger, DocumentText, Element3, Global, InfoCircle, Key, Logout, MessageText, Profile,
  Refresh2, Send2, Sms, TickCircle, Timer1, Trash, Verify,
} from "iconsax-react";
import Field from "@/components/auth/Field";
import { getClientAuth } from "@/lib/firebase/client";
import type { AccountData, ClientInquiry } from "@/lib/account-types";
import type { AccountApi } from "./AccountApp";
import { sendVerification } from "./AuthScreen";

type Tab = "overview" | "requests" | "new" | "profile";

/** Client-friendly names for the internal lead pipeline. */
const STATUS: Record<string, { label: string; chip: string; dot: string; step: number }> = {
  new: { label: "Received", chip: "bg-sky-400/10 text-sky-300 ring-sky-400/30", dot: "bg-sky-400", step: 0 },
  contacted: { label: "In discussion", chip: "bg-amber-400/10 text-amber-300 ring-amber-400/30", dot: "bg-amber-400", step: 1 },
  proposal: { label: "Proposal sent", chip: "bg-violet-400/10 text-violet-300 ring-violet-400/30", dot: "bg-violet-400", step: 2 },
  won: { label: "Project started", chip: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30", dot: "bg-emerald-400", step: 3 },
  lost: { label: "Closed", chip: "bg-slate-400/10 text-slate-300 ring-slate-400/30", dot: "bg-slate-400", step: -1 },
};
const STEPS = ["Received", "In discussion", "Proposal sent", "Project started"];
const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3–6 months", "Flexible / not sure"];
const SOURCE: Record<string, string> = { form: "Contact form", "ai-chat": "Ask Kamboh AI", account: "Your account" };

const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

type Props = {
  user: User;
  data: AccountData;
  setData: (d: AccountData) => void;
  api: AccountApi;
  reload: () => Promise<AccountData>;
  refreshVerification: () => Promise<boolean>;
};

export default function Dashboard({ user, data, setData, api, reload, refreshVerification }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const first = (data.profile.name || user.email || "there").split(/[\s@]/)[0];

  const stats = useMemo(() => {
    const q = data.inquiries;
    return {
      total: q.length,
      active: q.filter((i) => i.status === "contacted" || i.status === "proposal").length,
      started: q.filter((i) => i.status === "won").length,
    };
  }, [data.inquiries]);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Element3 size={19} color="currentColor" /> },
    { id: "requests", label: "My requests", icon: <DocumentText size={19} color="currentColor" /> },
    { id: "new", label: "New request", icon: <Add size={19} color="currentColor" /> },
    { id: "profile", label: "Profile & security", icon: <Profile size={19} color="currentColor" /> },
  ];

  return (
    <div className="relative min-h-screen bg-[#07090E]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_30%_0%,rgba(59,130,246,.14),transparent_70%)]" />

      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-30 border-b border-white/[.06] bg-[#07090E]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5" aria-label="Kamboh Technologies home">
            <span className="grid h-9 w-9 place-items-center rounded-xl"><img src="/brand/logo-dark.png" alt="" width={24} height={27} /></span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-[13px] font-extrabold tracking-[.08em]">KAMBOH</span>
              <span className="block text-[8px] font-semibold tracking-[.4em] text-slate-400">TECHNOLOGIES</span>
            </span>
          </a>
          <nav className="ml-4 hidden items-center gap-1 text-sm text-slate-400 md:flex" aria-label="Website">
            <a href="/services" className="rounded-lg px-3 py-2 hover:bg-white/[.05] hover:text-white">Services</a>
            <a href="/blog" className="rounded-lg px-3 py-2 hover:bg-white/[.05] hover:text-white">Blog</a>
            <a href="/contact" className="rounded-lg px-3 py-2 hover:bg-white/[.05] hover:text-white">Contact</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2.5 rounded-xl border border-white/10 bg-white/[.03] py-1.5 pl-1.5 pr-3 sm:flex">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-bold">{first[0]?.toUpperCase()}</span>
              <span className="max-w-[180px] truncate text-sm text-slate-300">{data.profile.email}</span>
            </span>
            <button type="button" onClick={() => signOut(getClientAuth())} className="flex h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[.05] hover:text-white">
              <Logout size={17} color="currentColor" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-12">
        {/* ---------- Navigation ---------- */}
        <nav aria-label="Account sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {TABS.map((t) => (
              <li key={t.id} className="flex-none">
                <button
                  type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}
                  className={`flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${tab === t.id ? "bg-white/[.08] text-white ring-1 ring-inset ring-white/10" : "text-slate-400 hover:bg-white/[.04] hover:text-slate-200"}`}
                >
                  <span className={tab === t.id ? "text-cyan-300" : ""}>{t.icon}</span>
                  {t.label}
                  {t.id === "requests" && data.inquiries.length > 0 && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[11px]">{data.inquiries.length}</span>}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden rounded-2xl border border-white/[.06] bg-white/[.02] p-4 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Need help?</p>
            <a href="https://wa.me/923028207226" target="_blank" rel="noopener" className="mt-3 flex items-center gap-2 text-sm text-slate-300 hover:text-white"><MessageText size={16} color="#34D399" /> WhatsApp us</a>
            <a href="tel:+923028207226" className="mt-2 flex items-center gap-2 text-sm text-slate-300 hover:text-white"><Call size={16} color="#22D3EE" /> +92 302 8207226</a>
            <a href="mailto:info@kambohtechnologies.com" className="mt-2 flex items-center gap-2 text-sm text-slate-300 hover:text-white"><Sms size={16} color="#A78BFA" /> Email the team</a>
          </div>
        </nav>

        {/* ---------- Content ---------- */}
        <main id="main" key={tab} className="adm-rise min-w-0">
          {!data.emailVerified && <VerifyBanner user={user} refreshVerification={refreshVerification} />}

          {tab === "overview" && (
            <section aria-labelledby="ov-title">
              <h1 id="ov-title" className="text-3xl font-bold tracking-[-.03em] sm:text-4xl">Welcome, {first}.</h1>
              <p className="mt-2 text-slate-400">Here’s where your requests and projects with Kamboh Technologies stand.</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Stat label="Requests sent" value={stats.total} icon={<DocumentText size={20} color="#22D3EE" variant="Bulk" />} />
                <Stat label="In progress" value={stats.active} icon={<Timer1 size={20} color="#FBBF24" variant="Bulk" />} />
                <Stat label="Projects started" value={stats.started} icon={<TickCircle size={20} color="#34D399" variant="Bulk" />} />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <h2 className="text-lg font-bold">Latest requests</h2>
                {data.inquiries.length > 0 && <button type="button" onClick={() => setTab("requests")} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">View all</button>}
              </div>
              <div className="mt-3 space-y-3">
                {data.inquiries.slice(0, 3).map((q) => <RequestCard key={q.id} q={q} />)}
                {data.inquiries.length === 0 && <Empty onNew={() => setTab("new")} />}
              </div>

              <button type="button" onClick={() => setTab("new")} className="group mt-8 flex w-full items-center gap-4 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/[.08] via-blue-500/[.06] to-violet-500/[.08] p-5 text-left transition hover:border-cyan-400/40">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500"><Add size={24} color="#fff" /></span>
                <span className="min-w-0">
                  <span className="block font-bold">Start a new project</span>
                  <span className="block text-sm text-slate-400">Tell us what you need. Your contact details are added automatically.</span>
                </span>
                <ArrowRight2 size={20} color="currentColor" className="ml-auto flex-none text-slate-400 transition group-hover:translate-x-1" />
              </button>
            </section>
          )}

          {tab === "requests" && (
            <section aria-labelledby="rq-title">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 id="rq-title" className="text-3xl font-bold tracking-[-.03em]">My requests</h1>
                  <p className="mt-2 text-slate-400">Every request you’ve sent us and its current status.</p>
                </div>
                <button type="button" onClick={() => reload()} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[.05]"><Refresh2 size={16} color="currentColor" /> Refresh</button>
              </div>
              <div className="mt-6 space-y-3">
                {data.inquiries.map((q) => <RequestCard key={q.id} q={q} detailed />)}
                {data.inquiries.length === 0 && <Empty onNew={() => setTab("new")} />}
              </div>
              {!data.emailVerified && (
                <p className="mt-4 flex items-start gap-2 text-sm text-slate-500"><InfoCircle size={16} color="currentColor" className="mt-0.5 flex-none" /> Verify your email to also see requests you sent earlier with the contact form or Ask AI.</p>
              )}
            </section>
          )}

          {tab === "new" && <NewRequest data={data} api={api} reload={reload} onDone={() => setTab("requests")} goProfile={() => setTab("profile")} />}
          {tab === "profile" && <ProfileTab user={user} data={data} setData={setData} api={api} />}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[.04]">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function Empty({ onNew }: { onNew: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[.04]"><Briefcase size={24} color="#64748B" variant="Bulk" /></span>
      <p className="mt-4 font-semibold">No requests yet</p>
      <p className="mt-1 text-sm text-slate-500">When you send a request, you can follow its status here.</p>
      <button type="button" onClick={onNew} className="mt-5 rounded-xl bg-white/[.08] px-4 py-2.5 text-sm font-semibold hover:bg-white/[.12]">Send your first request</button>
    </div>
  );
}

function RequestCard({ q, detailed = false }: { q: ClientInquiry; detailed?: boolean }) {
  const st = STATUS[q.status] || STATUS.new;
  return (
    <article className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold">{q.service || "Project inquiry"}</h3>
          <p className="mt-1 text-xs text-slate-500">Sent {fmtDate(q.createdAt)} · via {SOURCE[q.source] || "website"}{q.timeline ? ` · ${q.timeline}` : ""}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${st.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} /> {st.label}
        </span>
      </div>
      {q.message && <p className={`mt-3 text-sm leading-relaxed text-slate-400 ${detailed ? "" : "line-clamp-2"}`}>{q.message}</p>}
      {detailed && st.step >= 0 && (
        <ol className="mt-5 grid grid-cols-4 gap-2" aria-label="Progress">
          {STEPS.map((label, i) => (
            <li key={label} className="min-w-0">
              <span className={`block h-1.5 rounded-full ${i <= st.step ? "bg-gradient-to-r from-cyan-400 to-violet-500" : "bg-white/10"}`} />
              <span className={`mt-2 block truncate text-[11px] ${i <= st.step ? "text-slate-300" : "text-slate-600"}`}>{label}</span>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

function VerifyBanner({ user, refreshVerification }: { user: User; refreshVerification: () => Promise<boolean> }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "checking" | "still">("idle");
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-400/25 bg-amber-400/[.06] p-5 sm:flex-row sm:items-center" role="status">
      <Verify size={26} color="#FBBF24" variant="Bulk" className="flex-none" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-amber-100">Verify your email address</p>
        <p className="mt-1 text-sm text-amber-100/70">
          {state === "sent" ? `A new link was sent to ${user.email}. Check spam too.` : state === "still" ? "Not verified yet. Open the link in the email, then press “I’ve verified”." : `We sent a link to ${user.email}. Verify it to send requests and see your earlier inquiries.`}
        </p>
      </div>
      <div className="flex flex-none gap-2">
        <button type="button" disabled={state === "sending"} onClick={async () => { setState("sending"); try { await sendVerification(user); setState("sent"); } catch { setState("idle"); } }} className="rounded-xl border border-amber-300/30 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-300/10 disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Resend"}
        </button>
        <button type="button" disabled={state === "checking"} onClick={async () => { setState("checking"); const ok = await refreshVerification().catch(() => false); if (!ok) setState("still"); }} className="rounded-xl bg-amber-300 px-3 py-2 text-sm font-bold text-amber-950 hover:bg-amber-200 disabled:opacity-50">
          {state === "checking" ? "Checking…" : "I’ve verified"}
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-white/10 bg-white/[.03] px-4 text-[15px] text-white outline-none transition hover:border-white/20 focus:border-cyan-400 focus:bg-white/[.05] focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]";

function NewRequest({ data, api, reload, onDone, goProfile }: { data: AccountData; api: AccountApi; reload: () => Promise<AccountData>; onDone: () => void; goProfile: () => void }) {
  const [service, setService] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const p = data.profile;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!service || message.trim().length < 20) {
      setError("Choose a service and describe your project in at least 20 characters.");
      return;
    }
    setBusy(true);
    try {
      await api("/api/account/inquiries", { method: "POST", body: JSON.stringify({ service, timeline, message }) });
      await reload();
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  };

  if (done) {
    return (
      <section className="rounded-3xl border border-emerald-400/25 bg-emerald-400/[.06] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/15"><TickCircle size={30} color="#34D399" variant="Bold" /></span>
        <h1 className="mt-5 text-2xl font-bold">Request sent</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-emerald-100/70">Thank you! Our team will reply by email, usually with a few questions about your project. You can follow the status under “My requests”.</p>
        <button type="button" onClick={onDone} className="mt-6 rounded-xl bg-white/[.08] px-5 py-2.5 text-sm font-semibold hover:bg-white/[.12]">View my requests</button>
      </section>
    );
  }

  return (
    <section aria-labelledby="nr-title">
      <h1 id="nr-title" className="text-3xl font-bold tracking-[-.03em]">New request</h1>
      <p className="mt-2 text-slate-400">Describe what you need. We’ll reply with questions, a suggested approach and next steps.</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-white/[.07] bg-white/[.02] px-5 py-4 text-sm text-slate-400">
        <span className="font-semibold text-slate-300">Sending as</span>
        <span className="flex items-center gap-1.5"><Profile size={15} color="currentColor" /> {p.name || "No name"}</span>
        <span className="flex items-center gap-1.5"><Sms size={15} color="currentColor" /> {p.email}</span>
        {p.phone && <span className="flex items-center gap-1.5"><Call size={15} color="currentColor" /> {p.phone}</span>}
        {p.company && <span className="flex items-center gap-1.5"><Building size={15} color="currentColor" /> {p.company}</span>}
        <button type="button" onClick={goProfile} className="ml-auto font-semibold text-cyan-300 hover:text-cyan-200">Edit details</button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nr-service" className="mb-2 block text-sm font-semibold text-slate-300">Service</label>
            <select id="nr-service" value={service} onChange={(e) => setService(e.target.value)} className={`${inputCls} h-12 bg-[#0C111D]`} required>
              <option value="">Choose a service</option>
              {Object.entries(data.services).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="nr-timeline" className="mb-2 block text-sm font-semibold text-slate-300">Timeline <span className="font-normal text-slate-500">(optional)</span></label>
            <select id="nr-timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} className={`${inputCls} h-12 bg-[#0C111D]`}>
              <option value="">Select a timeline</option>
              {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="nr-msg" className="mb-2 block text-sm font-semibold text-slate-300">Project description</label>
          <textarea id="nr-msg" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 1500))} rows={7} placeholder="What are you building, who is it for, and what should it do?" className={`${inputCls} resize-y py-3 leading-relaxed`} aria-describedby="nr-count" required />
          <p id="nr-count" className="mt-1.5 text-right text-xs text-slate-500">{message.length} / 1500</p>
        </div>

        {error && (
          <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-400/25 bg-rose-500/[.08] px-3.5 py-3 text-sm text-rose-200">
            <Danger size={18} color="#FB7185" className="mt-px flex-none" /> {error}
          </p>
        )}
        <button type="submit" disabled={busy || !data.emailVerified} className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 text-[15px] font-bold shadow-[0_12px_32px_-10px_rgba(59,130,246,.8)] transition hover:shadow-[0_16px_40px_-10px_rgba(59,130,246,1)] disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Send2 size={18} color="currentColor" />}
          {busy ? "Sending…" : "Send request"}
        </button>
        {!data.emailVerified && <p className="text-sm text-amber-200/80">Verify your email address (see the notice above) to send requests.</p>}
      </form>
    </section>
  );
}

function ProfileTab({ user, data, setData, api }: { user: User; data: AccountData; setData: (d: AccountData) => void; api: AccountApi }) {
  const [name, setName] = useState(data.profile.name);
  const [phone, setPhone] = useState(data.profile.phone);
  const [company, setCompany] = useState(data.profile.company);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [delError, setDelError] = useState("");
  const dirty = name !== data.profile.name || phone !== data.profile.phone || company !== data.profile.company;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ updatedAt: string }>("/api/account", { method: "PATCH", body: JSON.stringify({ name, phone, company }) });
      setData({ ...data, profile: { ...data.profile, name: name.trim(), phone: phone.trim(), company: company.trim(), updatedAt: r.updatedAt } });
      try { localStorage.setItem("kt-account", JSON.stringify({ name: name.trim().split(" ")[0] })); } catch {}
      setMsg({ ok: true, text: "Your details have been saved." });
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    }
    setBusy(false);
  };

  const remove = async () => {
    setDeleting(true);
    setDelError("");
    try {
      await api("/api/account", { method: "DELETE" });
      try { localStorage.removeItem("kt-account"); } catch {}
      await signOut(getClientAuth()).catch(() => {});
      location.href = "/";
    } catch (err) {
      setDelError((err as Error).message);
      setDeleting(false);
    }
  };

  return (
    <section aria-labelledby="pf-title" className="space-y-6">
      <div>
        <h1 id="pf-title" className="text-3xl font-bold tracking-[-.03em]">Profile & security</h1>
        <p className="mt-2 text-slate-400">These details are added to every request you send.</p>
      </div>

      <form onSubmit={save} className="space-y-4 rounded-2xl border border-white/[.07] bg-white/[.02] p-5 sm:p-6" noValidate>
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white/[.03] px-4 py-3 text-sm">
          <Sms size={18} color="#94A3B8" />
          <span className="text-slate-300">{data.profile.email}</span>
          {data.emailVerified
            ? <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300"><TickCircle size={13} color="currentColor" variant="Bold" /> Verified</span>
            : <span className="ml-auto rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">Not verified</span>}
        </div>
        <Field id="pf-name" label="Full name" type="text" autoComplete="name" value={name} onChange={setName} icon={<Profile size={19} color="currentColor" />} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pf-phone" label="Phone / WhatsApp (optional)" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={setPhone} icon={<Call size={19} color="currentColor" />} required={false} />
          <Field id="pf-company" label="Company (optional)" type="text" autoComplete="organization" value={company} onChange={setCompany} icon={<Building size={19} color="currentColor" />} required={false} />
        </div>
        {msg && <p role="status" className={`text-sm ${msg.ok ? "text-emerald-300" : "text-rose-300"}`}>{msg.text}</p>}
        <button type="submit" disabled={busy || !dirty || name.trim().length < 2} className="h-11 rounded-xl bg-white/[.1] px-5 text-sm font-bold transition hover:bg-white/[.15] disabled:cursor-not-allowed disabled:opacity-40">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="rounded-2xl border border-white/[.07] bg-white/[.02] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-bold"><Key size={18} color="#22D3EE" /> Password</h2>
        <p className="mt-1 text-sm text-slate-400">We’ll email you a secure link to choose a new password.</p>
        <button type="button" disabled={resetSent} onClick={async () => { await sendPasswordResetEmail(getClientAuth(), user.email || "").catch(() => {}); setResetSent(true); }} className="mt-4 h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/[.05] disabled:opacity-60">
          {resetSent ? "Reset link sent. Check your inbox" : "Send password reset email"}
        </button>
      </div>

      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/[.04] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-bold text-rose-200"><Trash size={18} color="#FB7185" /> Delete account</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          This permanently deletes your sign-in and saved profile. Requests you already sent stay with our team as business records, as explained in our{" "}
          <a href="/privacy-policy#accounts" className="text-cyan-300 hover:underline">Privacy Policy</a>; email us if you also want them deleted.
        </p>
        <label htmlFor="pf-del" className="mt-4 block text-sm text-slate-400">Type <b className="text-slate-200">DELETE</b> to confirm</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id="pf-del" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoComplete="off" className={`${inputCls} h-11 sm:max-w-[220px]`} />
          <button type="button" disabled={confirmText !== "DELETE" || deleting} onClick={remove} className="h-11 rounded-xl bg-rose-500 px-5 text-sm font-bold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-40">
            {deleting ? "Deleting…" : "Delete my account"}
          </button>
        </div>
        {delError && <p role="alert" className="mt-3 text-sm text-rose-300">{delError}</p>}
      </div>

      <p className="flex items-center gap-2 text-xs text-slate-600"><Global size={14} color="currentColor" /> Member since {fmtDate(data.profile.createdAt)}</p>
    </section>
  );
}
