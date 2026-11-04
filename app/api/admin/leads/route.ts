import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { LEADS_COLLECTION, toLead } from "@/lib/leads";

/** GET /api/admin/leads: the latest 1000 leads, newest first. */
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const snap = await getAdminDb().collection(LEADS_COLLECTION).orderBy("createdAt", "desc").limit(1000).get();
    return NextResponse.json({ leads: snap.docs.map((doc) => toLead(doc.id, doc.data())), admin: auth.email });
  } catch (error) {
    console.error("[admin] Loading leads failed:", error);
    return NextResponse.json({ error: "Could not load leads. Check that Firestore is enabled for the project." }, { status: 500 });
  }
}
