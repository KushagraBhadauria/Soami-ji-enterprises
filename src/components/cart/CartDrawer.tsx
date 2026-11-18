"use client";
import Link from "next/link";
import { useEffect } from "react";
import { FileText, ShoppingBag, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./QtyStepper";
import { inr } from "@/lib/format";
import { priceAfterDiscount } from "@/lib/types";
import { buttonClass } from "../ui/Button";

export function CartDrawer() {
  const { open, setOpen, lines, setQty, remove, total, totalMrp, count } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={clsx("fixed inset-0 z-[60]", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={clsx("absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity", open ? "opacity-100" : "opacity-0")} />
      <aside
        role="dialog"
        aria-label="Quotation list"
        className={clsx(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "invisible translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="font-display text-lg font-extrabold">Your quotation list</h3>
            <p className="text-sm text-slate-500">{count} item{count === 1 ? "" : "s"} selected</p>
          </div>
          <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <p className="mt-4 font-semibold">Nothing added yet</p>
            <p className="mt-1 text-sm text-slate-500">Add cameras, laptops or accessories and get an instant quotation — no payment needed.</p>
            <Link href="/products" onClick={() => setOpen(false)} className={buttonClass("primary", "md", "mt-6")}>
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
              {lines.map(({ product: p, qty }) => (
                <li key={p.id} className="flex gap-3 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url} alt={p.name} className="h-20 w-20 flex-none rounded-xl border border-slate-100 bg-slate-50 object-contain p-1" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug">{p.name}</p>
                      <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-red-500" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {inr(priceAfterDiscount(p.mrp, p.discount))} each
                      {p.discount > 0 && <span className="ml-1.5 text-slate-400 line-through">{inr(p.mrp)}</span>}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <QtyStepper size="sm" value={qty} onChange={(n) => setQty(p.id, n)} />
                      <span className="text-sm font-bold">{inr(priceAfterDiscount(p.mrp, p.discount) * qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t border-slate-100 bg-slate-50/70 px-5 py-5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Total MRP</span>
                <span className="line-through">{inr(totalMrp)}</span>
              </div>
              {totalMrp > total && (
                <div className="mt-1 flex justify-between text-sm font-semibold text-mint-500">
                  <span>You save</span>
                  <span>{inr(totalMrp - total)}</span>
                </div>
              )}
              <div className="mt-2 flex items-end justify-between">
                <span className="font-semibold">Estimated total</span>
                <span className="font-display text-2xl font-extrabold">{inr(total)}</span>
              </div>
              <Link href="/quote" onClick={() => setOpen(false)} className={buttonClass("primary", "lg", "mt-4 w-full")}>
                <FileText className="h-5 w-5" /> Get my quotation
              </Link>
              <p className="mt-2 text-center text-xs text-slate-500">Free • Instant PDF • No payment required</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
