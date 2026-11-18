import Link from "next/link";
import clsx from "clsx";
import { categories } from "@/lib/site";
import { CategoryIcon } from "../ui/CategoryIcon";

export function CategoryTabs({ active, counts }: { active?: string; counts: Record<string, number> }) {
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div className="-mx-4 mb-8 overflow-x-auto px-4 no-scrollbar">
      <div className="flex min-w-max gap-2">
        <Link href="/products" className={clsx("flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition", !active ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400")}>
          All products <span className={clsx("rounded-md px-1.5 text-xs", !active ? "bg-white/15" : "bg-slate-100")}>{all}</span>
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/products/${c.slug}`} className={clsx("flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition", active === c.slug ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400")}>
            <CategoryIcon icon={c.icon} className={clsx("h-4 w-4", active === c.slug ? "text-accent-400" : "text-brand-600")} />
            {c.title}
            <span className={clsx("rounded-md px-1.5 text-xs", active === c.slug ? "bg-white/15" : "bg-slate-100")}>{counts[c.slug] ?? 0}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
