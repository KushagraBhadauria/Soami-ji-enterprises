"use client";
import { Check, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import type { Product } from "@/lib/types";
import { priceAfterDiscount } from "@/lib/types";
import { inr } from "@/lib/format";
import { useCart } from "../cart/CartProvider";
import { QtyStepper } from "../cart/QtyStepper";
import { categoryBySlug } from "@/lib/site";

export function ProductCard({ product: p, showCategory }: { product: Product; showCategory?: boolean }) {
  const { add, qtyOf, setQty, setOpen } = useCart();
  const qty = qtyOf(p.id);
  const price = priceAfterDiscount(p.mrp, p.discount);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {p.discount > 0 && (
            <span className="rounded-lg bg-accent-500 px-2 py-1 text-xs font-extrabold text-ink shadow">{p.discount}% OFF</span>
          )}
          {p.condition === "used" && (
            <span className="rounded-lg bg-ink px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Second-hand</span>
          )}
        </div>
        {showCategory && (
          <span className="absolute right-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-600 backdrop-blur">
            {categoryBySlug(p.category)?.short}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-[1.02rem] font-bold leading-snug text-ink">{p.name}</h3>
        {p.description && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">{p.description}</p>}
        {p.location && (
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-brand-500" /> {p.location}
          </p>
        )}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-extrabold text-ink">{inr(price)}</span>
            {p.discount > 0 && <span className="text-sm text-slate-400 line-through">MRP {inr(p.mrp)}</span>}
          </div>
          {p.discount > 0 && <p className="text-xs font-semibold text-mint-500">You save {inr(p.mrp - price)}</p>}
          <div className="mt-3">
            {qty === 0 ? (
              <button
                onClick={() => {
                  add(p);
                  toast.success("Added to quotation", {
                    description: p.name,
                    action: { label: "View list", onClick: () => setOpen(true) },
                  });
                }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[.98]"
              >
                <Plus className="h-4 w-4" /> Add to quotation
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <QtyStepper value={qty} onChange={(n) => setQty(p.id, n)} />
                <button
                  onClick={() => setOpen(true)}
                  className={clsx("flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-mint-500/10 text-sm font-semibold text-mint-500 hover:bg-mint-500/15")}
                >
                  <Check className="h-4 w-4" /> Added
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
