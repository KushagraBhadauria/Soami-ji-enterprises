"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, FileText, Loader2, Lock, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/cart/CartProvider";
import { QtyStepper } from "@/components/cart/QtyStepper";
import { buttonClass } from "@/components/ui/Button";
import { inr } from "@/lib/format";
import { priceAfterDiscount } from "@/lib/types";
import { categoryBySlug } from "@/lib/site";

export function QuoteBuilder() {
  const { lines, setQty, remove, total, totalMrp, count, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [err, setErr] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 2) e.name = "Please enter your name";
    const ph = f.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    if (!/^[6-9]\d{9}$/.test(ph)) e.phone = "Enter a valid 10-digit mobile number";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, items: lines.map((l) => ({ id: l.product.id, qty: l.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      clear();
      toast.success(`Quotation ${data.quote_no} generated!`);
      router.push(`/quotation/${data.id}?new=1`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate quotation");
      setBusy(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600"><ShoppingBag className="h-8 w-8" /></span>
        <h2 className="mt-5 font-display text-2xl font-extrabold">Your quotation list is empty</h2>
        <p className="mt-2 text-slate-500">Add cameras, laptops or accessories — any quantity — and come back here to generate your quotation.</p>
        <Link href="/products" className={buttonClass("primary", "lg", "mt-7")}>Browse products</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      {/* Items */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-extrabold">Selected items</h2>
            <p className="text-sm text-slate-500">{lines.length} product{lines.length > 1 ? "s" : ""} · {count} unit{count > 1 ? "s" : ""}</p>
          </div>
          <Link href="/products" className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
            <Plus className="h-4 w-4" /> Add more
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {lines.map(({ product: p, qty }) => {
            const unit = priceAfterDiscount(p.mrp, p.discount);
            return (
              <li key={p.id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center">
                <div className="flex flex-1 gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url} alt="" className="h-20 w-20 flex-none rounded-xl border border-slate-100 bg-slate-50 object-contain p-1" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {categoryBySlug(p.category)?.short}{p.condition === "used" && " · Second-hand"}
                    </p>
                    <p className="font-bold leading-snug">{p.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{p.description}</p>
                    <p className="mt-1 text-sm">
                      <b>{inr(unit)}</b>
                      {p.discount > 0 && <span className="ml-2 text-slate-400 line-through">{inr(p.mrp)}</span>}
                      {p.discount > 0 && <span className="ml-2 text-xs font-bold text-accent-600">{p.discount}% off</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <QtyStepper value={qty} onChange={(n) => setQty(p.id, n)} />
                  <span className="w-24 text-right font-display text-lg font-extrabold">{inr(unit * qty)}</span>
                  <button type="button" onClick={() => remove(p.id)} className="text-slate-400 hover:text-red-500" aria-label="Remove">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="space-y-1.5 rounded-b-3xl bg-slate-50 px-6 py-5">
          <div className="flex justify-between text-slate-500"><span>Total MRP</span><span>{inr(totalMrp)}</span></div>
          <div className="flex justify-between font-semibold text-mint-500"><span>Discount</span><span>− {inr(totalMrp - total)}</span></div>
          <div className="flex items-end justify-between pt-2"><span className="font-bold">Estimated total</span><span className="font-display text-3xl font-extrabold">{inr(total)}</span></div>
        </div>
      </div>

      {/* Customer form */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card md:p-7">
          <h2 className="font-display text-xl font-extrabold">Your details</h2>
          <p className="mt-1 text-sm text-slate-500">Needed to prepare your quotation. We&apos;ll only use them to contact you about it.</p>
          <div className="mt-6 space-y-4">
            <Field label="Full name" required error={err.name}>
              <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Rahul Sharma" autoComplete="name" />
            </Field>
            <Field label="Mobile number" required error={err.phone}>
              <div className="flex">
                <span className="grid place-items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">+91</span>
                <input className="input rounded-l-none" inputMode="numeric" maxLength={14} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="10-digit mobile" autoComplete="tel" />
              </div>
            </Field>
            <Field label="Email" hint="optional" error={err.email}>
              <input className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" autoComplete="email" />
            </Field>
            <Field label="Address / area" hint="optional">
              <input className="input" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="Locality, city" autoComplete="street-address" />
            </Field>
            <Field label="Anything else?" hint="optional">
              <textarea className="input resize-none" rows={2} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="e.g. 2-floor house, need installation" />
            </Field>
          </div>
          <button type="submit" disabled={busy} className={buttonClass("primary", "lg", "mt-6 w-full")}>
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
            {busy ? "Generating…" : "Generate quotation"}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5" /> No payment. Instant PDF download.
          </p>
        </div>
        <Link href="/products" className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Continue browsing
        </Link>
      </div>
    </form>
  );
}

function Field({ label, required, hint, error, children }: { label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="ml-1 font-normal text-slate-400">({hint})</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
