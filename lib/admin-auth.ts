import { NextResponse } from "next/server";
import { getAdminAuth, isFirebaseAdminConfigured } from "./firebase/admin";

/** Emails allowed into /admin, from ADMIN_EMAILS (comma-separated). */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

type AdminCheck = { ok: true; email: string } | { ok: false; response: NextResponse };

/** Verifies the Firebase ID token in "Authorization: Bearer <token>" and the email allowlist. */
export async function requireAdmin(request: Request): Promise<AdminCheck> {
  if (!isFirebaseAdminConfigured()) {
    return { ok: false, response: NextResponse.json({ error: "Firebase Admin is not configured on the server." }, { status: 503 }) };
  }
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token, true);
    const email = (decoded.email || "").toLowerCase();
    if (!email || !adminEmails().includes(email)) {
      return { ok: false, response: NextResponse.json({ error: "This account does not have admin access." }, { status: 403 }) };
    }
    return { ok: true, email };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 }) };
  }
}
