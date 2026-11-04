"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Danger, Logout } from "iconsax-react";
import { getClientAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import LoginScreen from "./LoginScreen";
import LeadsDashboard from "./LeadsDashboard";

type Phase = "loading" | "not-configured" | "signed-out" | "denied" | "ready";

export type AdminApi = <T = unknown>(path: string, init?: RequestInit) => Promise<{ ok: boolean; status: number; data: T & { error?: string } }>;

export default function AdminApp() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [denied, setDenied] = useState("");

  useEffect(() => {
    if (!isFirebaseClientConfigured()) {
      setPhase("not-configured");
      return;
    }
    const auth = getClientAuth();
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setPhase("signed-out");
        return;
      }
      try {
        const res = await fetch("/api/admin/me", { headers: { Authorization: `Bearer ${await u.getIdToken()}` } });
        if (res.ok) {
          setPhase("ready");
        } else {
          const data = await res.json().catch(() => ({}));
          // Only a 403 means "not on the allowlist"; anything else is a server or session problem.
          const fallback =
            res.status === 403
              ? "This account does not have admin access."
              : res.status >= 500
                ? `The admin server is not responding correctly (error ${res.status}). Please check the hosting environment variables and server logs.`
                : `Could not verify your access (error ${res.status}). Please sign in again.`;
          setDenied(data.error || fallback);
          setPhase("denied");
        }
      } catch {
        setDenied("Could not reach the server. Check your connection and try again.");
        setPhase("denied");
      }
    });
  }, []);

  const api: AdminApi = useCallback(
    async (path, init = {}) => {
      const token = user ? await user.getIdToken() : "";
      const res = await fetch(path, {
        ...init,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers || {}) },
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    },
    [user],
  );

  const logout = () => signOut(getClientAuth());

  if (phase === "loading") {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
          Loading admin…
        </div>
      </div>
    );
  }

  if (phase === "not-configured") {
    return (
      <Notice title="Firebase is not configured" icon={<Danger size={28} color="currentColor" />}>
        Add the <code className="text-cyan-300">NEXT_PUBLIC_FIREBASE_*</code> keys to <code className="text-cyan-300">.env.local</code> and restart the dev server.
      </Notice>
    );
  }

  if (phase === "signed-out") return <LoginScreen />;

  if (phase === "denied") {
    return (
      <Notice title="No admin access" icon={<Danger size={28} color="currentColor" />}>
        <p>{denied}</p>
        <p className="mt-2 text-slate-500">Signed in as {user?.email}</p>
        <button onClick={logout} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold hover:border-cyan-400/60 hover:bg-cyan-400/5">
          <Logout size={18} color="currentColor" /> Sign out
        </button>
      </Notice>
    );
  }

  return <LeadsDashboard email={user?.email || ""} api={api} onSignOut={logout} />;
}

function Notice({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0E1422] p-8 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-amber-400/10 text-amber-300">{icon}</div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <div className="mt-3 text-sm leading-relaxed text-slate-400">{children}</div>
      </div>
    </div>
  );
}
