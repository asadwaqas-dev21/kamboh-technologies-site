import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Account | Kamboh Technologies",
  description: "Sign in or create a Kamboh Technologies client account to send project requests and follow their status.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://kambohtechnologies.com/account" },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#07090E] font-sans text-slate-100 antialiased">{children}</div>;
}
