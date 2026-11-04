import { NextResponse } from "next/server";
import { EMAIL } from "@/lib/contact";
import { isMailConfigured, sendMail } from "@/lib/email/send";
import { saveLead } from "@/lib/leads";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { isSameOrigin, loadFirebaseAdmin, verifyRequest } from "@/lib/server-auth";
import { emailRows, escapeHtml, SERVICE_OPTIONS } from "@/lib/service-options";

/** POST /api/account/inquiries: a signed-in client with a verified email sends a new project request. */
const LIMITS = [
  { keyPrefix: "acct_inq_minute", maxRequests: 2, windowMs: 60_000 },
  { keyPrefix: "acct_inq_hour", maxRequests: 8, windowMs: 3_600_000 },
];
const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const auth = await verifyRequest(request);
  if (!auth.ok) return auth.response;
  if (!auth.user.email_verified) {
    return NextResponse.json({ error: "Please verify your email address first. Check your inbox for the verification link." }, { status: 403 });
  }
  for (const limit of LIMITS) {
    if (!checkRateLimit(request, limit).allowed) {
      return NextResponse.json({ error: "You've sent several requests in a short time. Please wait a little and try again." }, { status: 429 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const service = SERVICE_OPTIONS[s(body.service, 20)] || "";
  const timeline = s(body.timeline, 80);
  const message = s(body.message, 1500);
  if (!service || message.length < 20) {
    return NextResponse.json({ error: "Choose a service and describe your project in at least 20 characters." }, { status: 400 });
  }

  // Contact details come from the saved profile, never from the request body.
  let profile: Record<string, string> = {};
  try {
    const { getAdminDb } = await loadFirebaseAdmin();
    profile = ((await getAdminDb().collection("clients").doc(auth.user.uid).get()).data() as Record<string, string>) || {};
  } catch (error) {
    console.error("[account] Reading the profile failed:", error);
  }
  const email = auth.user.email || "";
  const name = profile.name || auth.user.name || email.split("@")[0];
  const phone = profile.phone || "";
  const company = profile.company || "";

  const [saved, emailed] = await Promise.all([
    saveLead({ name, email, phone, company, service, message, timeline, source: "account", sourcePage: "/account", uid: auth.user.uid }),
    notifyTeam({ name, email, phone, company, service, timeline, message }),
  ]);
  if (!saved && !emailed) {
    console.error("[account] Inquiry not delivered: lead storage and email both unavailable.");
    return NextResponse.json({ error: "We couldn't send your request. Please email info@kambohtechnologies.com." }, { status: 503 });
  }
  confirmToClient(email, name, service).catch((error) => console.error("[account] Confirmation email failed:", error));
  return NextResponse.json({ ok: true });
}

async function notifyTeam(d: Record<"name" | "email" | "phone" | "company" | "service" | "timeline" | "message", string>) {
  if (!isMailConfigured()) return false;
  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL?.trim() || EMAIL,
      subject: `Client Account Request — ${d.name}${d.company ? ` (${d.company})` : ""}`,
      html: `<div style="font-family:sans-serif;max-width:560px;"><h2 style="margin-bottom:4px;">New Project Request</h2><p style="color:#666;margin-top:0;">Sent from a verified client account on Kamboh Technologies</p><table style="border-collapse:collapse;width:100%;">${emailRows([
        ["Name", d.name], ["Email", d.email], ["Phone", d.phone], ["Company", d.company], ["Service", d.service], ["Timeline", d.timeline], ["Project description", d.message],
      ])}</table></div>`,
      replyTo: d.email,
    });
    return true;
  } catch (error) {
    console.error("[account] Team email failed:", error);
    return false;
  }
}

async function confirmToClient(email: string, name: string, service: string) {
  if (!isMailConfigured() || !email) return;
  await sendMail({
    to: email,
    subject: "We received your request — Kamboh Technologies",
    html: `<div style="font-family:sans-serif;max-width:560px;color:#1f2937;line-height:1.6;"><h2 style="color:#0B1220;">Thank you, ${escapeHtml(name.split(" ")[0] || "there")}!</h2><p>We received your request for <b>${escapeHtml(service)}</b>. Our team will reply by email, usually with a few questions about your project.</p><p>You can follow its status anytime in <a href="https://kambohtechnologies.com/account">your account</a>.</p><p style="color:#6b7280;font-size:13px;">Kamboh Technologies (Private) Limited · Johar Town, Lahore · +92 302 8207226</p></div>`,
  });
}
