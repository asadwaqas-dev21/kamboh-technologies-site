/** Service choices shared by the contact form (/api/contact) and client accounts (/api/account/inquiries). */
export const SERVICE_OPTIONS: Record<string, string> = {
  mobile: "Mobile app development",
  web: "Web application development",
  custom: "Custom software solutions",
  uiux: "UI/UX design",
  api: "Backend & API development",
  ai: "AI-powered automation",
  seo: "SEO & digital growth",
  secp: "SECP company registration",
  tax: "Company tax filing",
  unsure: "Not sure yet",
};

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Simple, inline-styled table rows for notification emails. */
export function emailRows(rows: [string, string][]) {
  return rows
    .filter(([, v]) => v)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#0B1220;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#333;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
}
