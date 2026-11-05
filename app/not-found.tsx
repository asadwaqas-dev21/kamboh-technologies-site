import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | Kamboh Technologies",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen flex-1 place-items-center overflow-hidden bg-[#07090E] px-5 font-sans text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_20%_15%,rgba(59,130,246,.2),transparent_70%),radial-gradient(40%_50%_at_85%_85%,rgba(217,70,239,.14),transparent_70%)]" />
      <div className="relative max-w-lg text-center">
        <a href="/" className="mx-auto mb-10 inline-flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white">
            <img src="/brand/logo-dark.png" alt="" width={30} height={34} />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[15px] font-extrabold tracking-[.08em]">KAMBOH</span>
            <span className="block text-[9px] font-semibold tracking-[.42em] text-slate-400">TECHNOLOGIES</span>
          </span>
        </a>
        <p className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-8xl font-bold tracking-tighter text-transparent">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">This page could not be found.</h1>
        <p className="mt-3 text-slate-400">The link may be old or mistyped. Try one of these instead:</p>
        <nav className="mt-8 flex flex-wrap justify-center gap-3" aria-label="Main pages">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={
                i === 0
                  ? "rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-bold shadow-lg shadow-indigo-500/30 hover:brightness-110"
                  : "rounded-full border border-white/15 px-6 py-3 text-sm font-semibold hover:border-cyan-400/60 hover:bg-cyan-400/5"
              }
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
