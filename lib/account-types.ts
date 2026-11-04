/** Shapes returned by /api/account and used by the /account screens. */
export type ClientProfile = { name: string; email: string; phone: string; company: string; createdAt: string; updatedAt: string };
export type ClientInquiry = { id: string; service: string; message: string; timeline: string; status: string; source: string; createdAt: string; updatedAt: string };
export type AccountData = { profile: ClientProfile; emailVerified: boolean; inquiries: ClientInquiry[]; services: Record<string, string> };
