import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "./SectionHeading";

export function PageHero({ eyebrow, title, sub, crumb, children }: { eyebrow: string; title: ReactNode; sub?: ReactNode; crumb: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="container relative py-12 md:py-24">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-200">{crumb}</span>
        </nav>
        <Eyebrow dark>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold tracking-tight md:text-6xl md:leading-[1.05]">{title}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg text-slate-300">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
