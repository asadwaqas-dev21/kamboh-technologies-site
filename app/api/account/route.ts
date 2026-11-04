import { NextResponse } from "next/server";
import { LEAD_STATUSES, LEADS_COLLECTION } from "@/lib/leads";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { fail, isSameOrigin, loadFirebaseAdmin, setupError, verifyRequest } from "@/lib/server-auth";
import { SERVICE_OPTIONS } from "@/lib/service-options";
import type { ClientInquiry, ClientProfile } from "@/lib/account-types";

/**
 * Client accounts (/account). Profiles live in Firestore "clients/<uid>"; all access goes through
 * this server route with a verified Firebase ID token (Firestore rules deny direct access).
 *   GET     profile + the client's own inquiries (matched by uid, or by verified email)
 *   PATCH   update name / phone / company
 *   DELETE  delete the profile and the sign-in account
 */
const CLIENTS = "clients";
const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");


export async function GET(request: Request) {
  const auth = await verifyRequest(request);
  if (!auth.ok) return auth.response;
  const { uid, email = "", email_verified, name: tokenName = "" } = auth.user;
  try {
    const { getAdminDb } = await loadFirebaseAdmin();
    const db = getAdminDb();
    const ref = db.collection(CLIENTS).doc(uid);
    const snap = await ref.get();
    let profile: ClientProfile;
    if (snap.exists) {
      const d = snap.data()!;
      profile = { name: d.name || "", email: d.email || email, phone: d.phone || "", company: d.company || "", createdAt: d.createdAt || "", updatedAt: d.updatedAt || "" };
      if (d.email !== email) await ref.set({ email, updatedAt: new Date().toISOString() }, { merge: true });
    } else {
      const now = new Date().toISOString();
      profile = { name: String(tokenName).slice(0, 120), email, phone: "", company: "", createdAt: now, updatedAt: now };
      await ref.set(profile);
    }

    // Inquiries sent from this account, plus (once the email is verified) earlier ones sent with the same email.
    const leads = db.collection(LEADS_COLLECTION);
    const queries = [leads.where("uid", "==", uid).get()];
    if (email && email_verified) queries.push(leads.where("email", "in", [...new Set([email, email.toLowerCase()])]).get());
    const seen = new Map<string, ClientInquiry>();
    for (const result of await Promise.all(queries)) {
      for (const doc of result.docs) {
        const d = doc.data();
        seen.set(doc.id, {
          id: doc.id,
          service: d.service || "",
          message: d.message || "",
          timeline: d.timeline || "",
          status: LEAD_STATUSES.includes(d.status) ? d.status : "new",
          source: d.source || "form",
          createdAt: d.createdAt || "",
          updatedAt: d.updatedAt || d.createdAt || "",
        });
      }
    }
    const inquiries = [...seen.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50);
    return NextResponse.json({ profile, emailVerified: !!email_verified, inquiries, services: SERVICE_OPTIONS });
  } catch (error) {
    console.error("[account] Loading the account failed:", error);
    return NextResponse.json({ error: setupError(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!checkRateLimit(request, { keyPrefix: "account_update", maxRequests: 20, windowMs: 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many changes. Please wait a minute." }, { status: 429 });
  }
  const auth = await verifyRequest(request);
  if (!auth.ok) return auth.response;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const name = s(body.name, 120);
  const phone = s(body.phone, 40);
  const company = s(body.company, 160);
  if (name.length < 2) return fail("Please enter your full name.", 400).response;
  if (phone && !/^[+()\d\s-]{7,40}$/.test(phone)) return fail("Please enter a valid phone number.", 400).response;
  try {
    const { getAdminAuth, getAdminDb } = await loadFirebaseAdmin();
    const updatedAt = new Date().toISOString();
    await getAdminDb().collection(CLIENTS).doc(auth.user.uid).set({ name, phone, company, email: auth.user.email || "", updatedAt }, { merge: true });
    await getAdminAuth().updateUser(auth.user.uid, { displayName: name });
    return NextResponse.json({ ok: true, updatedAt });
  } catch (error) {
    console.error("[account] Updating the profile failed:", error);
    return NextResponse.json({ error: "We couldn't save your profile. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const auth = await verifyRequest(request);
  if (!auth.ok) return auth.response;
  try {
    const { getAdminAuth, getAdminDb } = await loadFirebaseAdmin();
    await getAdminDb().collection(CLIENTS).doc(auth.user.uid).delete();
    await getAdminAuth().deleteUser(auth.user.uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[account] Deleting the account failed:", error);
    return NextResponse.json({ error: "We couldn't delete your account. Please email info@kambohtechnologies.com." }, { status: 500 });
  }
}
