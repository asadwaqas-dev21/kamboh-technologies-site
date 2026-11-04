import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/** GET /api/admin/me: confirms the signed-in user is on the admin allowlist. */
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json({ email: auth.email });
}
