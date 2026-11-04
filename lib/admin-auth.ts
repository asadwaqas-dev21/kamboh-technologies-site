import type { NextResponse } from "next/server";
import { fail, verifyRequest } from "./server-auth";

/** Emails allowed into /admin, from ADMIN_EMAILS (comma-separated). */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

type AdminCheck = { ok: true; email: string } | { ok: false; response: NextResponse };

/**
 * Verifies the Firebase ID token and the email allowlist.
 * Anyone can create a client account, so admins must also have a verified email:
 * otherwise someone could register an allow-listed address they do not own.
 */
export async function requireAdmin(request: Request): Promise<AdminCheck> {
  const auth = await verifyRequest(request);
  if (!auth.ok) return auth;
  const email = (auth.user.email || "").toLowerCase();
  if (!email || !adminEmails().includes(email)) return fail("This account does not have admin access.", 403);
  if (!auth.user.email_verified) return fail("Verify this admin email address first (check your inbox), then sign in again.", 403);
  return { ok: true, email };
}
