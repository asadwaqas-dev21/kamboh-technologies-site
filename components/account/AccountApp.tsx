"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Danger } from "iconsax-react";
import { getClientAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import type { AccountData } from "@/lib/account-types";
import AuthScreen, { takePendingName } from "./AuthScreen";
import Dashboard from "./Dashboard";

export type AccountApi = <T = Record<string, unknown>>(path: string, init?: RequestInit) => Promise<T>;

/** Remembers a signed-in visitor's first name so the static site's navbar can greet them. */
function rememberForNavbar(name: string | null) {
  try {
    if (name === null) localStorage.removeItem("kt-account");
    else localStorage.setItem("kt-account", JSON.stringify({ name: name.split(" ")[0] || "Account" }));
  } catch {}
}

type Phase = "loading" | "signed-out" | "ready" | "error";

export default function AccountApp() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<AccountData | null>(null);
  const [error, setError] = useState("");
  const userRef = useRef<User | null>(null);

  const api: AccountApi = useCallback(async (path, init = {}) => {
    const u = userRef.current;
    if (!u) throw new Error("Not signed in.");
    const res = await fetch(path, {
      ...init,
      headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers, Authorization: `Bearer ${await u.getIdToken()}` },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Something went wrong (error ${res.status}). Please try again.`);
    return body;
  }, []);

  const load = useCallback(async () => {
    const d = await api<AccountData>("/api/account");
    setData(d);
    rememberForNavbar(d.profile.name || userRef.current?.email || "");
    return d;
  }, [api]);

  useEffect(() => {
    if (!isFirebaseClientConfigured()) {
      setError("Accounts are not available right now. Please contact us by email or WhatsApp.");
      setPhase("error");
      return;
    }
    return onAuthStateChanged(getClientAuth(), async (u) => {
      userRef.current = u;
      setUser(u);
      if (!u) {
        setData(null);
        rememberForNavbar(null);
        setPhase("signed-out");
        return;
      }
      setPhase("loading");
      try {
        // A brand-new account saves its name first, so the profile starts complete.
        const pendingName = takePendingName();
        if (pendingName) await api("/api/account", { method: "PATCH", body: JSON.stringify({ name: pendingName, phone: "", company: "" }) }).catch(() => {});
        await load();
        setPhase("ready");
      } catch (e) {
        setError((e as Error).message);
        setPhase("error");
      }
    });
  }, [api, load]);

  /** After verifying the email in another tab: refresh the token so the server sees email_verified. */
  const refreshVerification = useCallback(async () => {
    const u = userRef.current;
    if (!u) return false;
    await u.reload();
    await u.getIdToken(true);
    const d = await load();
    return d.emailVerified;
  }, [load]);

  if (phase === "loading") {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-4 text-sm text-slate-500">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
          Loading your account…
        </div>
      </div>
    );
  }
  if (phase === "signed-out") return <AuthScreen />;
  if (phase === "error" || !data || !user) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#13243C] p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-400/10"><Danger size={28} color="#FBBF24" /></span>
          <h1 className="mt-5 text-xl font-bold">We couldn’t load your account</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{error || "Please try again."}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => location.reload()} className="rounded-xl bg-white/[.06] px-4 py-2.5 text-sm font-semibold hover:bg-white/10">Try again</button>
            {user && <button type="button" onClick={() => signOut(getClientAuth())} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[.05]">Sign out</button>}
          </div>
        </div>
      </div>
    );
  }
  return <Dashboard user={user} data={data} setData={setData} api={api} reload={load} refreshVerification={refreshVerification} />;
}
