"use client";

import { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, type User,
} from "firebase/auth";
import {
  ArrowLeft, ArrowRight, Danger, DocumentText, Eye, EyeSlash, Lock, Profile, ShieldTick, Sms, TickCircle, Timer1,
} from "iconsax-react";
import Field from "@/components/auth/Field";
import { getClientAuth } from "@/lib/firebase/client";

/** The name typed at sign-up, saved to the profile by AccountApp right after the account is created. */
let pendingName = "";
export const takePendingName = () => {
  const n = pendingName;
  pendingName = "";
  return n;
};

/** Sends the verification email, returning the visitor to /account afterwards when the domain allows it. */
export async function sendVerification(user: User) {
  try {
    await sendEmailVerification(user, { url: `${location.origin}/account` });
  } catch (err) {
    if ((err as { code?: string }).code === "auth/unauthorized-continue-uri") await sendEmailVerification(user);
    else throw err;
  }
}

export function authMessage(code: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Sign in instead, or reset your password.";
    case "auth/weak-password":
      return "Choose a stronger password: at least 8 characters with letters and numbers.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    case "auth/operation-not-allowed":
      return "Email sign-up is not enabled yet. Please contact us instead.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function passwordScore(p: string) {
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/i.test(p) && /\d/.test(p)) score++;
  if (/[^a-z0-9]/i.test(p) || (/[a-z]/.test(p) && /[A-Z]/.test(p))) score++;
  return score;
}
const SCORE_LABEL = ["Too short", "Weak", "Fair", "Good", "Strong"];
const SCORE_COLOR = ["bg-rose-400", "bg-rose-400", "bg-amber-400", "bg-cyan-400", "bg-emerald-400"];

type View = "signin" | "signup" | "reset";

export default function AuthScreen() {
  const [view, setView] = useState<View>(() => (typeof location !== "undefined" && new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [shake, setShake] = useState(0);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, [view]);

  const fail = (msg: string) => {
    setError(msg);
    setShake((n) => n + 1);
  };

  const score = passwordScore(password);
  const signupReady = name.trim().length >= 2 && email.trim() && score >= 2 && password.length >= 8 && /[a-z]/i.test(password) && /\d/.test(password) && agree;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const auth = getClientAuth();
    try {
      if (view === "signin") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        return; // AccountApp takes over.
      }
      if (view === "signup") {
        if (!signupReady) {
          fail("Please complete every field, use a password with at least 8 characters including letters and numbers, and accept the terms.");
          setBusy(false);
          return;
        }
        pendingName = name.trim();
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() }).catch(() => {});
        await sendVerification(cred.user).catch(() => {});
        return;
      }
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err) {
      pendingName = "";
      fail(authMessage((err as { code?: string }).code || ""));
    }
    setBusy(false);
  };

  const switchView = (v: View) => {
    setView(v);
    setError("");
    setSent(false);
    setPassword("");
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  const heading = {
    signin: ["Welcome back", "Sign in to follow your requests and projects."],
    signup: ["Create your account", "Send project requests and follow every update in one place."],
    reset: ["Reset password", "Enter your email and we’ll send you a secure reset link."],
  }[view];

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[#05070C] lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- Brand panel ---------- */}
      <section className="relative hidden overflow-hidden border-r border-white/[.06] lg:flex lg:flex-col">
        <div className="adm-float pointer-events-none absolute -left-[15%] -top-[20%] h-[70%] w-[80%] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,.32),transparent)] blur-2xl" />
        <div className="adm-float-rev pointer-events-none absolute -bottom-[25%] -right-[10%] h-[75%] w-[75%] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,.34),transparent)] blur-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(75%_70%_at_50%_45%,#000,transparent)]" />

        <div className="relative z-10 flex flex-1 flex-col p-12 xl:p-16">
          <a href="/" className="flex w-fit items-center gap-3" aria-label="Kamboh Technologies home">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-lg shadow-cyan-500/30">
              <img src="/logo.png" alt="" width={30} height={34} />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-[.08em]">KAMBOH</span>
              <span className="block text-[9px] font-semibold tracking-[.42em] text-slate-400">TECHNOLOGIES</span>
            </span>
          </a>

          <div className="my-auto max-w-lg py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[.07] px-3 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34D399]" /> Client account
            </span>
            <p className="mt-6 text-5xl font-bold leading-[1.05] tracking-[-.04em] xl:text-6xl">
              Your projects, <br />
              <span className="adm-sheen bg-gradient-to-r from-cyan-300 via-blue-400 via-60% to-fuchsia-400 bg-clip-text text-transparent">one simple place.</span>
            </p>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-slate-400">
              Send a request in seconds, see where it stands and keep your details ready for every new project.
            </p>
            <ul className="mt-9 space-y-4">
              {[
                { icon: <DocumentText size={20} color="#22D3EE" variant="Bulk" />, t: "Requests in seconds", d: "Your details are saved, so you only describe the project" },
                { icon: <Timer1 size={20} color="#A78BFA" variant="Bulk" />, t: "Follow every status", d: "Received, in discussion, proposal sent, project started" },
                { icon: <ShieldTick size={20} color="#34D399" variant="Bulk" />, t: "Private and secure", d: "Encrypted sign-in; delete your account anytime" },
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
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Kamboh Technologies (Private) Limited · SECP CUIN 0297023</p>
        </div>
      </section>

      {/* ---------- Form panel ---------- */}
      <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,.1),transparent_70%)] lg:hidden" />
        <div className="relative w-full max-w-[420px]">
          <a href="/" className="mb-10 flex w-fit items-center gap-3 lg:hidden" aria-label="Kamboh Technologies home">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-lg shadow-cyan-500/25">
              <img src="/logo.png" alt="" width={30} height={34} />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-[.08em]">KAMBOH</span>
              <span className="block text-[9px] font-semibold tracking-[.42em] text-slate-400">CLIENT ACCOUNT</span>
            </span>
          </a>

          {view !== "reset" && (
            <div className="mb-8 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[.03] p-1" role="tablist" aria-label="Account">
              {(["signin", "signup"] as const).map((v) => (
                <button
                  key={v} type="button" role="tab" aria-selected={view === v} onClick={() => switchView(v)}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition ${view === v ? "bg-white/10 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  {v === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
          )}

          <div key={view} className="adm-rise">
            {view === "reset" && (
              <button type="button" onClick={() => switchView("signin")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
                <ArrowLeft size={16} color="currentColor" /> Back to sign in
              </button>
            )}
            <h1 className="text-[2rem] font-bold leading-tight tracking-[-.03em] lg:text-[2rem]">{heading[0]}</h1>
            <p className="mt-2 text-[15px] text-slate-400">{heading[1]}</p>

            {view === "reset" && sent ? (
              <div className="mt-8 rounded-2xl border border-emerald-400/25 bg-emerald-400/[.07] p-5" role="status">
                <div className="flex items-start gap-3">
                  <TickCircle size={22} color="#34D399" variant="Bold" className="mt-0.5 flex-none" />
                  <div>
                    <p className="font-semibold text-emerald-200">Check your inbox</p>
                    <p className="mt-1 text-sm leading-relaxed text-emerald-100/70">If <b className="text-emerald-100">{email}</b> has an account, a reset link is on its way. Check your spam folder too.</p>
                  </div>
                </div>
                <button type="button" onClick={() => switchView("signin")} className="mt-5 w-full rounded-xl border border-white/10 py-3 text-sm font-semibold transition hover:bg-white/[.05]">Back to sign in</button>
              </div>
            ) : (
              <form key={shake} onSubmit={submit} className={`mt-8 space-y-4 ${shake ? "adm-shake" : ""}`} noValidate>
                {view === "signup" && (
                  <Field id="acc-name" label="Full name" type="text" autoComplete="name" value={name} onChange={setName} icon={<Profile size={19} color="currentColor" />} inputRef={firstRef} />
                )}
                <Field
                  id="acc-email" label="Email address" type="email" autoComplete="email" value={email} onChange={setEmail}
                  icon={<Sms size={19} color="currentColor" />} inputRef={view === "signup" ? undefined : firstRef} invalid={!!error && view !== "signup"}
                />
                {view !== "reset" && (
                  <Field
                    id="acc-pass" label="Password" type={show ? "text" : "password"} autoComplete={view === "signup" ? "new-password" : "current-password"}
                    value={password} onChange={setPassword} icon={<Lock size={19} color="currentColor" />} onKey={onKey}
                    describedBy={view === "signup" ? "acc-pass-help" : undefined}
                    trailing={
                      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[.06] hover:text-slate-200">
                        {show ? <EyeSlash size={19} color="currentColor" /> : <Eye size={19} color="currentColor" />}
                      </button>
                    }
                  />
                )}

                {view === "signup" && (
                  <div id="acc-pass-help">
                    <div className="flex gap-1.5" aria-hidden="true">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className={`h-1 flex-1 rounded-full transition ${password && i < Math.max(score, 1) ? SCORE_COLOR[score] : "bg-white/10"}`} />
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {password ? <><b className="text-slate-300">{SCORE_LABEL[score]}</b> · </> : null}
                      At least 8 characters with letters and numbers.
                    </p>
                  </div>
                )}

                {view === "signin" && (
                  <div className="flex min-h-[20px] items-center justify-between">
                    <span className={`flex items-center gap-1.5 text-xs font-medium text-amber-300 transition ${capsLock ? "opacity-100" : "opacity-0"}`}>
                      <Danger size={14} color="currentColor" /> Caps Lock is on
                    </span>
                    <button type="button" onClick={() => switchView("reset")} className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">Forgot password?</button>
                  </div>
                )}

                {view === "signup" && (
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-400">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 flex-none accent-cyan-400" />
                    <span>
                      I agree to the <a href="/terms-and-conditions" target="_blank" className="font-semibold text-cyan-300 underline-offset-2 hover:underline">Terms</a> and{" "}
                      <a href="/privacy-policy#accounts" target="_blank" className="font-semibold text-cyan-300 underline-offset-2 hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                )}

                {error && (
                  <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-400/25 bg-rose-500/[.08] px-3.5 py-3 text-sm text-rose-200">
                    <Danger size={18} color="#FB7185" className="mt-px flex-none" /> {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy || !email.trim() || (view === "signin" && !password) || (view === "signup" && !signupReady)}
                  className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-[15px] font-bold shadow-[0_12px_32px_-10px_rgba(59,130,246,.8)] transition hover:shadow-[0_16px_40px_-10px_rgba(59,130,246,1)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      {view === "signin" ? "Signing in…" : view === "signup" ? "Creating account…" : "Sending link…"}
                    </>
                  ) : (
                    <>
                      {view === "signin" ? "Sign in" : view === "signup" ? "Create account" : "Send reset link"}
                      <ArrowRight size={18} color="currentColor" className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Just have a quick question? <a href="/contact" className="font-semibold text-slate-300 hover:text-white">Contact us</a> without an account.
          </p>
          <a href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-200">
            <ArrowLeft size={15} color="currentColor" /> Back to website
          </a>
        </div>
      </section>
    </div>
  );
}
