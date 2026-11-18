import Link from "next/link";
import { Eye, EyeOff, FileText, ImagePlus, Package, Trash2, Users } from "lucide-react";
import clsx from "clsx";
import { AdminHeader } from "./AdminHeader";
import { listLeads, listProducts, listQuotations, usingSupabase } from "@/lib/db";
import { categories, categoryBySlug, type Category } from "@/lib/site";
import { priceAfterDiscount } from "@/lib/types";
import { inr } from "@/lib/format";
import { removeProduct, toggleProduct } from "../actions";
import { buttonClass } from "@/components/ui/Button";
import { ConfirmButton } from "./ConfirmButton";

export const dynamic = "force-dynamic";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const cat = categoryBySlug(c ?? "")?.slug as Category | undefined;
  const [products, leads, quotes] = await Promise.all([listProducts({ includeInactive: true }), listLeads(), listQuotations()]);
  const shown = cat ? products.filter((p) => p.category === cat) : products;

  const stats = [
    { label: "Products", value: products.length, icon: Package, href: "/admin" },
    { label: "Future customers", value: leads.length, icon: Users, href: "/admin/leads" },
    { label: "Quotations", value: quotes.length, icon: FileText, href: "/admin/quotations" },
  ];

  return (
    <>
      <AdminHeader title="Products" sub="Everything listed on your website." action={<Link href="/admin/products/new" className={buttonClass("primary", "md")}><ImagePlus className="h-5 w-5" /> Upload product</Link>} />
      {!usingSupabase && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <b>Demo mode:</b> Supabase isn&apos;t connected yet, so data is saved on this computer only. Add your Supabase keys in <code>.env.local</code> before going live.
        </div>
      )}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: I, href }) => (
          <Link key={label} href={href} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:shadow-lift">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><I className="h-6 w-6" /></span>
            <span><span className="block font-display text-3xl font-extrabold">{value}</span><span className="text-sm text-slate-500">{label}</span></span>
          </Link>
        ))}
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar">
        <Link href="/admin" className={clsx("whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold", !cat ? "bg-ink text-white" : "bg-white text-slate-600 border border-slate-200")}>All ({products.length})</Link>
        {categories.map((k) => (
          <Link key={k.slug} href={`/admin?c=${k.slug}`} className={clsx("whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold", cat === k.slug ? "bg-ink text-white" : "bg-white text-slate-600 border border-slate-200")}>
            {k.title} ({products.filter((p) => p.category === k.slug).length})
          </Link>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="font-bold">No products here yet</p>
          <Link href="/admin/products/new" className={buttonClass("primary", "md", "mt-4")}>Upload your first product</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {shown.map((p) => (
            <div key={p.id} className={clsx("flex gap-3 rounded-2xl border bg-white p-3 shadow-card", p.active ? "border-slate-200" : "border-dashed border-slate-300 opacity-60")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt="" className="h-24 w-24 flex-none rounded-xl bg-slate-50 object-contain p-1" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">{categoryBySlug(p.category)?.short}{p.condition === "used" && " · Used"}</p>
                <p className="line-clamp-2 text-sm font-bold leading-snug">{p.name}</p>
                <p className="mt-0.5 text-sm"><b>{inr(priceAfterDiscount(p.mrp, p.discount))}</b>{p.discount > 0 && <span className="ml-1.5 text-xs text-slate-400">({p.discount}% off {inr(p.mrp)})</span>}</p>
                <div className="mt-auto flex gap-1 pt-2">
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="active" value={String(!p.active)} />
                    <button className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200" title={p.active ? "Hide from website" : "Show on website"}>
                      {p.active ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
                    </button>
                  </form>
                  <form action={removeProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`Delete "${p.name}"?`} className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
