import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Kamboh Technologies",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0B1220] font-sans text-slate-100 antialiased">{children}</div>;
}
