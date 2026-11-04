import { NextResponse } from "next/server";
import { EMAIL, PHONE_DISPLAY, WHATSAPP_HREF } from "@/lib/contact";
import { isMailConfigured, sendMail } from "@/lib/email/send";
import { saveLead } from "@/lib/leads";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { escapeHtml, SERVICE_OPTIONS } from "@/lib/service-options";

/** Contact form on Home and /contact (public/assets/site.js). Emails each inquiry to the team. */
const FORM_LIMITS = [
  { keyPrefix: "contact_minute", maxRequests: 3, windowMs: 60_000 },
  { keyPrefix: "contact_hour", maxRequests: 10, windowMs: 3_600_000 },
];
const SERVICES = SERVICE_OPTIONS;
const FALLBACK = `Please WhatsApp us at ${WHATSAPP_HREF}, call ${PHONE_DISPLAY} or email ${EMAIL}.`;

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = s(body.name, 120);
  const email = s(body.email, 160);
  const company = s(body.company, 160);
  const service = SERVICES[s(body.service, 20)] || "";
  const message = s(body.message, 1500);

  // Honeypot: bots fill the hidden field; pretend success and drop it.
  if (s(body.website, 200)) return NextResponse.json({ ok: true });

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !service || message.length < 20) {
    return NextResponse.json({ error: "Please check the highlighted fields and try again." }, { status: 400 });
  }

  for (const limit of FORM_LIMITS) {
    if (!checkRateLimit(request, limit).allowed) {
      return NextResponse.json({ error: `Too many messages from this connection. ${FALLBACK}` }, { status: 429 });
    }
  }

  let sourcePage = "";
  try {
    const referer = request.headers.get("referer");
    if (referer) sourcePage = new URL(referer).pathname;
  } catch {}

  // The inquiry counts as delivered once it is saved for the admin dashboard OR emailed.
  const [saved, emailed] = await Promise.all([
    saveLead({ name, email, company, service, message, source: "form", sourcePage }),
    emailInquiry({ name, email, company, service, message }),
  ]);
  if (saved || emailed) return NextResponse.json({ ok: true });
  console.error("[contact] Inquiry not delivered: lead storage and email both unavailable.");
  return NextResponse.json({ error: `We couldn't send your message. ${FALLBACK}` }, { status: 503 });
}

async function emailInquiry({ name, email, company, service, message }: Record<"name" | "email" | "company" | "service" | "message", string>) {
  if (!isMailConfigured()) return false;
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Company", company],
    ["Service", service],
    ["Project description", message],
  ]
    .filter(([, v]) => v)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#0B1220;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#333;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL?.trim() || EMAIL,
      subject: `Website Inquiry — ${name}${company ? ` (${company})` : ""}`,
      html: `<div style="font-family:sans-serif;max-width:560px;"><h2 style="margin-bottom:4px;">New Project Inquiry</h2><p style="color:#666;margin-top:0;">Sent from the contact form on Kamboh Technologies</p><table style="border-collapse:collapse;width:100%;">${rows}</table></div>`,
      replyTo: email,
    });
    return true;
  } catch (error) {
    console.error("[contact] Email send failed:", error);
    return false;
  }
}
