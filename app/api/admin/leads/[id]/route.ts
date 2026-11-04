import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { LEAD_STATUSES, LEADS_COLLECTION, newNoteId, toLead, type LeadStatus } from "@/lib/leads";

type Ctx = { params: Promise<{ id: string }> };

const STATUS_LABEL: Record<LeadStatus, string> = { new: "New", contacted: "Contacted", proposal: "Proposal", won: "Won", lost: "Lost" };

/** PATCH /api/admin/leads/:id with { status } or { note }. */
export async function PATCH(request: Request, { params }: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;

  let body: { status?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ref = getAdminDb().collection(LEADS_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "Lead not found." }, { status: 404 });

  const now = new Date().toISOString();
  const update: Record<string, unknown> = { updatedAt: now };

  if (typeof body.status === "string") {
    if (!LEAD_STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ error: "Unknown status." }, { status: 400 });
    }
    const status = body.status as LeadStatus;
    const before = toLead(id, snap.data()!).status;
    if (status !== before) {
      update.status = status;
      update.activity = FieldValue.arrayUnion({ id: newNoteId(), at: now, by: auth.email, text: `Status changed from ${STATUS_LABEL[before]} to ${STATUS_LABEL[status]}` });
    }
  } else if (typeof body.note === "string") {
    const text = body.note.trim().slice(0, 2000);
    if (!text) return NextResponse.json({ error: "The note is empty." }, { status: 400 });
    update.notes = FieldValue.arrayUnion({ id: newNoteId(), at: now, by: auth.email, text });
  } else {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  await ref.update(update);
  const fresh = await ref.get();
  return NextResponse.json({ lead: toLead(id, fresh.data()!) });
}

/** DELETE /api/admin/leads/:id */
export async function DELETE(request: Request, { params }: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  await getAdminDb().collection(LEADS_COLLECTION).doc(id).delete();
  return NextResponse.json({ ok: true });
}
