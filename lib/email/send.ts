/** Send transactional email via Resend. Set RESEND_API_KEY (and EMAIL_FROM on a verified domain) to enable it. */

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function fromAddress() {
  return process.env.EMAIL_FROM?.trim() || "Kamboh Technologies <noreply@kambohtechnologies.com>";
}

export async function sendMail(input: { to: string; subject: string; html: string; replyTo?: string }) {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    throw new Error("Email not configured. Set RESEND_API_KEY.");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend failed: ${res.status} ${text}`);
  }
}
