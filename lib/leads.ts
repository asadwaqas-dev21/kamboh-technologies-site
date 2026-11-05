import { getAdminDb, isFirebaseAdminConfigured } from "./firebase/admin";

export const LEAD_STATUSES = ["new", "contacted", "proposal", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = "form" | "ai-chat" | "account";

export type LeadNote = { id: string; text: string; at: string; by: string };
export type LeadActivity = { id: string; at: string; text: string; by: string };

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  timeline: string;
  source: LeadSource;
  sourcePage: string;
  /** Firebase uid when the inquiry was sent from a signed-in client account. */
  uid: string;
  status: LeadStatus;
  notes: LeadNote[];
  activity: LeadActivity[];
  createdAt: string;
  updatedAt: string;
};

export const LEADS_COLLECTION = "leads";

const stamp = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export type NewLead = Pick<Lead, "name" | "source"> & Partial<Pick<Lead, "email" | "phone" | "company" | "service" | "message" | "timeline" | "sourcePage" | "uid">>;

/** Saves an inquiry to Firestore. Returns false (and logs) when Firebase is not configured or the write fails. */
export async function saveLead(input: NewLead): Promise<boolean> {
  if (!isFirebaseAdminConfigured()) return false;
  try {
    const now = new Date().toISOString();
    await getAdminDb()
      .collection(LEADS_COLLECTION)
      .add({
        name: input.name,
        email: input.email || "",
        phone: input.phone || "",
        company: input.company || "",
        service: input.service || "",
        message: input.message || "",
        timeline: input.timeline || "",
        source: input.source,
        sourcePage: input.sourcePage || "",
        uid: input.uid || "",
        status: "new",
        notes: [],
        activity: [{ id: stamp(), at: now, text: input.source === "ai-chat" ? "Lead created from Ask AI chat" : input.source === "account" ? "Lead created from a client account" : "Lead created from contact form", by: "system" }],
        createdAt: now,
        updatedAt: now,
        createdAtServer: require("firebase-admin/firestore").FieldValue.serverTimestamp(),
      });
    return true;
  } catch (error) {
    console.error("[leads] Saving the lead failed:", error);
    return false;
  }
}

/** Converts a Firestore document into the shape the admin dashboard uses. */
export function toLead(id: string, d: FirebaseFirestore.DocumentData): Lead {
  return {
    id,
    name: d.name || "",
    email: d.email || "",
    phone: d.phone || "",
    company: d.company || "",
    service: d.service || "",
    message: d.message || "",
    timeline: d.timeline || "",
    source: d.source === "ai-chat" || d.source === "account" ? d.source : "form",
    sourcePage: d.sourcePage || "",
    uid: d.uid || "",
    status: LEAD_STATUSES.includes(d.status) ? d.status : "new",
    notes: Array.isArray(d.notes) ? d.notes : [],
    activity: Array.isArray(d.activity) ? d.activity : [],
    createdAt: d.createdAt || "",
    updatedAt: d.updatedAt || d.createdAt || "",
  };
}

export const newNoteId = stamp;
