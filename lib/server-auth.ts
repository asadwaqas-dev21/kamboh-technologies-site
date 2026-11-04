import { NextResponse } from "next/server";
import type { DecodedIdToken } from "firebase-admin/auth";

/**
 * Shared sign-in checks for /api/admin/* and /api/account/*.
 * Firebase Admin is loaded lazily, so a server set-up problem returns a readable JSON error
 * (shown in the admin and account screens) instead of an empty 500.
 */
export type Fail = { ok: false; response: NextResponse };

export const fail = (error: string, status: number): Fail => ({ ok: false, response: NextResponse.json({ error }, { status }) });

export async function loadFirebaseAdmin() {
  return import("./firebase/admin");
}

/** Describes a server-side failure without leaking secrets: the error type and a short message. */
export function setupError(error: unknown) {
  const e = error as { name?: string; message?: string; code?: string };
  const detail = [e?.code, e?.message].filter(Boolean).join(": ").replace(/-----BEGIN[\s\S]*?-----END[^-]*-----/g, "[key]").slice(0, 200);
  return `Server set-up error${detail ? ` (${detail})` : ""}. Check the Firebase environment variables on the server.`;
}

/** Verifies the Firebase ID token in "Authorization: Bearer <token>". */
export async function verifyRequest(request: Request): Promise<{ ok: true; user: DecodedIdToken } | Fail> {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return fail("Not signed in.", 401);

  let admin: Awaited<ReturnType<typeof loadFirebaseAdmin>>;
  try {
    admin = await loadFirebaseAdmin();
    if (!admin.isFirebaseAdminConfigured()) return fail("Firebase Admin is not configured on the server.", 503);
  } catch (error) {
    console.error("[auth] Loading Firebase Admin failed:", error);
    return fail(setupError(error), 500);
  }

  try {
    const user = await admin.getAdminAuth().verifyIdToken(token, true);
    return { ok: true, user };
  } catch (error) {
    const code = (error as { code?: string }).code || "";
    if (code.startsWith("auth/")) return fail("Your session has expired. Please sign in again.", 401);
    console.error("[auth] Token verification failed:", error);
    return fail(setupError(error), 500);
  }
}

/** Same-origin check for state-changing requests from the browser. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
