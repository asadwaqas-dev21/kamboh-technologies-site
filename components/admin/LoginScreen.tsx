"use client";

import { useEffect, useRef, useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import {
  ArrowLeft, ArrowRight, Danger, Eye, EyeSlash, Flash, Lock, Profile2User, ShieldTick, Sms, TickCircle, TrendUp,
} from "iconsax-react";
import { getClientAuth } from "@/lib/firebase/client";

function authMessage(code: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    case "auth/operation-not-allowed":
      return "Email sign-in is not enabled in Firebase yet.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

type View = "signin" | "reset";

export default function LoginScreen() {
  const [view, setView] = useState<View>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [shake, setShake] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, [view]);

  const fail = (msg: string) => {
    setError(msg);
    setShake((n) => n + 1);
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(getClientAuth(), email.trim(), password);
    } catch (err) {
      fail(authMessage((err as { code?: string }).code || ""));
      setBusy(false);
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendPasswordResetEmail(getClientAuth(), email.trim());
      setSent(true);
    } catch (err) {
      fail(authMessage((err as { code?: string }).code || ""));
    }
    setBusy(false);
  };

  const switchView = (v: View) => {
    setView(v);
    setError("");
    setSent(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[#05070C] lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- Brand panel ---------- */}
      <section className="relative hidden overflow-hidden border-r border-white/[.06] lg:flex lg:flex-col">
        <div className="adm-float pointer-events-none absolute -left-[15%] -top-[20%] h-[70%] w-[80%] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,.45),transparent)] blur-2xl" />
        <div className="adm-float-rev pointer-events-none absolute -bottom-[25%] -right-[10%] h-[75%] w-[75%] rounded-full bg-[radial-gradient(closest-side,rgba(217,70,239,.32),transparent)] blur-2xl" />
        <div className="adm-float pointer-events-none absolute left-[35%] top-[40%] h-[40%] w-[40%] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,.22),transparent)] blur-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(75%_70%_at_50%_45%,#000,transparent)]" />

        <div className="relative z-10 flex flex-1 flex-col p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-lg shadow-cyan-500/30">
              <img src="/logo.png" alt="" width={30} height={34} />
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-extrabold tracking-[.08em]">KAMBOH</p>
              <p className="text-[9px] font-semibold tracking-[.42em] text-slate-400">TECHNOLOGIES</p>
            </div>
          </div>

          <div className="my-auto max-w-lg py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/[.07] px-3 py-1 text-xs font-semibold text-cyan-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#22D3EE]" /> Admin console
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-[-.04em] xl:text-6xl">
              Every lead, <br />
              <span className="adm-sheen bg-gradient-to-r from-cyan-300 via-blue-400 via-60% to-fuchsia-400 bg-clip-text text-transparent">one clear pipeline.</span>
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-slate-400">
              Inquiries from the website and Ask AI land here, ready to follow up, track and close.
            </p>

            <ul className="mt-9 space-y-4">
              {[
                { icon: <Profile2User size={20} color="#60A5FA" variant="Bulk" />, t: "All inquiries in one place", d: "Contact form and Ask AI, saved automatically" },
                { icon: <TrendUp size={20} color="#A78BFA" variant="Bulk" />, t: "Track every deal", d: "New, contacted, proposal, won or lost" },
                { icon: <ShieldTick size={20} color="#34D399" variant="Bulk" />, t: "Private by design", d: "Approved staff only, verified on every request" },
              ].map((f) => (
                <li key={f.t} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-white/10 bg-white/[.04] backdrop-blur">{f.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-100">{f.t}</p>
                    <p className="text-sm text-slate-500">{f.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Kamboh Technologies (Private) Limited</p>
        </div>

        {/* Floating preview card */}
        <div className="adm-bob pointer-events-none absolute bottom-[14%] right-[-6%] z-10 w-72 rounded-2xl border border-white/10 bg-[#0E1422]/80 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl xl:right-[2%]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">This week</span>
            <span className="flex items-center gap-1 text-emerald-300"><Flash size={13} color="currentColor" variant="Bold" /> Live</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[["New", "bg-sky-400"], ["Proposal", "bg-violet-400"], ["Won", "bg-emerald-400"]].map(([l, c]) => (
              <div key={l} className="rounded-xl bg-white/[.04] p-2.5">
                <span className={`block h-1.5 w-1.5 rounded-full ${c}`} />
                <span className="mt-2 block h-2 w-8 rounded bg-white/20" />
                <span className="mt-1.5 block text-[10px] text-slate-500">{l}</span>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 240 56" className="mt-3 h-12 w-full" aria-hidden="true">
            <defs><linearGradient id="admSpark" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3B82F6" stopOpacity=".45" /><stop offset="1" stopColor="#3B82F6" stopOpacity="0" /></linearGradient></defs>
            <path d="M0 46 C30 40 45 30 70 34 S110 18 140 22 S190 6 240 8 L240 56 L0 56Z" fill="url(#admSpark)" />
            <path d="M0 46 C30 40 45 30 70 34 S110 18 140 22 S190 6 240 8" fill="none" stroke="#60A5FA" strokeWidth="2" />
          </svg>
        </div>
      </section>

      {/* ---------- Form panel ---------- */}
      <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(59,130,246,.12),transparent_70%)] lg:hidden" />
        <div className="relative w-full max-w-[400px]">
          {/* Mobile brand */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-lg shadow-cyan-500/25">
              <img src="/logo.png" alt="" width={30} height={34} />
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-extrabold tracking-[.08em]">KAMBOH</p>
              <p className="text-[9px] font-semibold tracking-[.42em] text-slate-400">ADMIN CONSOLE</p>
            </div>
          </div>

          <div key={view} className="adm-rise">
            {view === "signin" ? (
              <>
                <h2 className="text-[2rem] font-bold leading-tight tracking-[-.03em]">Sign in</h2>
                <p className="mt-2 text-[15px] text-slate-400">Welcome back. Use your Kamboh staff account.</p>
              </>
            ) : (
              <>
                <button type="button" onClick={() => switchView("signin")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
                  <ArrowLeft size={16} color="currentColor" /> Back to sign in
                </button>
                <h2 className="text-[2rem] font-bold leading-tight tracking-[-.03em]">Reset password</h2>
                <p className="mt-2 text-[15px] text-slate-400">Enter your email and we’ll send you a secure reset link.</p>
              </>
            )}

            {view === "reset" && sent ? (
              <div className="mt-8 rounded-2xl border border-emerald-400/25 bg-emerald-400/[.07] p-5">
                <div className="flex items-start gap-3">
                  <TickCircle size={22} color="#34D399" variant="Bold" className="mt-0.5 flex-none" />
                  <div>
                    <p className="font-semibold text-emerald-200">Check your inbox</p>
                    <p className="mt-1 text-sm leading-relaxed text-emerald-100/70">If <b className="text-emerald-100">{email}</b> has an admin account, a reset link is on its way. It may take a minute.</p>
                  </div>
                </div>
                <button type="button" onClick={() => switchView("signin")} className="mt-5 w-full rounded-xl border border-white/10 py-3 text-sm font-semibold transition hover:bg-white/[.05]">
                  Back to sign in
                </button>
              </div>
            ) : (
              <form key={shake} onSubmit={view === "signin" ? signIn : reset} className={`mt-8 space-y-4 ${shake ? "adm-shake" : ""}`} noValidate>
                <Field
                  id="adm-email" label="Email address" type="email" autoComplete="email" value={email} onChange={setEmail}
                  icon={<Sms size={19} color="currentColor" />} inputRef={emailRef} invalid={!!error}
                />
                {view === "signin" && (
                  <Field
                    id="adm-pass" label="Password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={setPassword}
                    icon={<Lock size={19} color="currentColor" />} invalid={!!error} onKey={onKey}
                    trailing={
                      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[.06] hover:text-slate-200">
                        {show ? <EyeSlash size={19} color="currentColor" /> : <Eye size={19} color="currentColor" />}
                      </button>
                    }
                  />
                )}

                {view === "signin" && (
                  <div className="flex min-h-[20px] items-center justify-between">
                    <span className={`flex items-center gap-1.5 text-xs font-medium text-amber-300 transition ${capsLock ? "opacity-100" : "opacity-0"}`}>
                      <Danger size={14} color="currentColor" /> Caps Lock is on
                    </span>
                    <button type="button" onClick={() => switchView("reset")} className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-400/25 bg-rose-500/[.08] px-3.5 py-3 text-sm text-rose-200">
                    <Danger size={18} color="#FB7185" className="mt-px flex-none" /> {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy || !email.trim() || (view === "signin" && !password)}
                  className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-[15px] font-bold shadow-[0_12px_32px_-10px_rgba(99,102,241,.8)] transition hover:shadow-[0_16px_40px_-10px_rgba(99,102,241,1)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      {view === "signin" ? "Signing in…" : "Sending link…"}
                    </>
                  ) : (
                    <>
                      {view === "signin" ? "Sign in" : "Send reset link"}
                      <ArrowRight size={18} color="currentColor" className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/[.06] bg-white/[.02] px-4 py-3.5">
            <ShieldTick size={20} color="#34D399" variant="Bulk" className="flex-none" />
            <p className="text-xs leading-relaxed text-slate-500">Restricted area. Access is limited to approved Kamboh Technologies staff and every request is verified.</p>
          </div>
          <a href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-200">
            <ArrowLeft size={15} color="currentColor" /> Back to website
          </a>
        </div>
      </section>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  invalid?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  onKey?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

/** Input with a floating label: the label sits inside the field and moves up on focus or when filled. */
function Field({ id, label, type, autoComplete, value, onChange, icon, trailing, invalid, inputRef, onKey }: FieldProps) {
  return (
    <div
      className={`group relative flex h-[58px] items-center rounded-xl border bg-white/[.03] pl-3.5 pr-2 transition focus-within:bg-white/[.05] focus-within:shadow-[0_0_0_4px_rgba(34,211,238,.12)] ${
        invalid ? "border-rose-400/50 focus-within:border-rose-400" : "border-white/10 hover:border-white/20 focus-within:border-cyan-400"
      }`}
    >
      <span className="flex-none text-slate-500 transition group-focus-within:text-cyan-300">{icon}</span>
      <div className="relative ml-3 h-full flex-1">
        <input
          ref={inputRef}
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          onKeyUp={onKey}
          placeholder=" "
          required
          aria-invalid={invalid || undefined}
          className="adm-input peer h-full w-full bg-transparent pt-4 text-[15px] text-white outline-none"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[15px] text-slate-500 transition-all duration-200 peer-focus:top-[15px] peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-cyan-300 peer-[:not(:placeholder-shown)]:top-[15px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold"
        >
          {label}
        </label>
      </div>
      {trailing}
    </div>
  );
}
