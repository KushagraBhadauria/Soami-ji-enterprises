import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/site";
import { CategoryIcon } from "../ui/CategoryIcon";
import { SectionHeading } from "../ui/SectionHeading";

const tones = [
  "from-brand-600 to-indigo-700",
  "from-ink-700 to-ink",
  "from-sky-600 to-brand-700",
  "from-slate-700 to-slate-900",
  "from-indigo-600 to-violet-800",
];

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <SectionHeading eyebrow="Shop by catalogue" title="Everything you need, in one place" sub="New and second-hand products, each with today's discount shown upfront." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link key={c.slug} href={`/products/${c.slug}`} className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${tones[i % tones.length]} ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"} ${i === categories.length - 1 && categories.length % 2 === 1 ? "sm:col-span-2" : ""} p-6 text-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift`}>
              <div className="grid-bg absolute inset-0 opacity-60" />
              <CategoryIcon icon={c.icon} className="absolute -bottom-6 -right-6 h-40 w-40 text-white/10 transition duration-500 group-hover:scale-110 group-hover:text-white/15" strokeWidth={1.2} />
              <div className="relative flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                  <CategoryIcon icon={c.icon} className="h-6 w-6" />
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition group-hover:bg-accent-500 group-hover:text-ink">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="relative mt-auto">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{counts[c.slug] ?? 0} products</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold">{c.title}</h3>
                <p className="mt-2 text-sm text-white/75">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
