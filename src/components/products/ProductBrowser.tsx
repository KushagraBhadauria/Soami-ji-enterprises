"use client";
import { useMemo, useState } from "react";
import { PackageSearch, Search } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/lib/types";
import { priceAfterDiscount } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Sort = "new" | "low" | "high" | "discount";
type Cond = "all" | "new" | "used";

export function ProductBrowser({ products, showCategory }: { products: Product[]; showCategory?: boolean }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("new");
  const [cond, setCond] = useState<Cond>("all");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let l = products.filter((p) => (cond === "all" ? true : p.condition === cond));
    if (term) l = l.filter((p) => `${p.name} ${p.description} ${p.location}`.toLowerCase().includes(term));
    const price = (p: Product) => priceAfterDiscount(p.mrp, p.discount);
    if (sort === "low") l = [...l].sort((a, b) => price(a) - price(b));
    if (sort === "high") l = [...l].sort((a, b) => price(b) - price(a));
    if (sort === "discount") l = [...l].sort((a, b) => b.discount - a.discount);
    return l;
  }, [products, q, sort, cond]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or model number…" className="h-11 w-full rounded-xl bg-slate-50 pl-11 pr-4 text-[15px] outline-none focus:bg-white focus:ring-2 focus:ring-brand-200" />
        </label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", "new", "used"] as Cond[]).map((c) => (
            <button key={c} onClick={() => setCond(c)} className={clsx("h-11 whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition", cond === c ? "bg-ink text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
              {c === "all" ? "All" : c === "new" ? "New" : "Second-hand"}
            </button>
          ))}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-11 rounded-xl bg-slate-100 px-3 text-sm font-semibold text-slate-700 outline-none">
            <option value="new">Newest</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="discount">Biggest discount</option>
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 px-6 py-20 text-center">
          <PackageSearch className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-bold">{products.length === 0 ? "Products coming soon" : "No products match your search"}</p>
          <p className="mt-1 max-w-md text-slate-500">
            {products.length === 0 ? "We're updating this catalogue. Call or WhatsApp us for the latest stock and prices." : "Try a different keyword or filter."}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Showing <b className="text-ink">{list.length}</b> product{list.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} showCategory={showCategory} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
