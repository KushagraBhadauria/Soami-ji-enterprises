import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, Eye, MessageCircle, Phone } from "lucide-react";
import { getQuotation } from "@/lib/db";
import { site } from "@/lib/site";
import { fmtDate, inr } from "@/lib/format";
import { buttonClass } from "@/components/ui/Button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your quotation", robots: { index: false } };

export default async function QuotationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> }) {
  const { id } = await params;
  const isNew = (await searchParams).new === "1";
  const q = await getQuotation(id);
  if (!q) notFound();
  const pdf = `/api/quotations/${q.id}/pdf`;
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi ${site.name}, I generated quotation ${q.quote_no} (${inr(q.grand_total)}) on your website. Please contact me. — ${q.customer_name}`)}`;

  return (
    <section className="grid-bg-light bg-slate-50 py-12 md:py-16">
      <div className="container max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 flex-none place-items-center rounded-2xl bg-mint-500/15 text-mint-500">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-mint-500">{isNew ? "Quotation generated" : "Quotation"}</p>
                <h1 className="font-display text-2xl font-extrabold md:text-3xl">{q.quote_no}</h1>
                <p className="mt-1 text-slate-500">
                  For <b className="text-ink">{q.customer_name}</b> · {fmtDate(q.created_at)} · {q.items.length} item{q.items.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-slate-500">Grand total</p>
              <p className="font-display text-4xl font-extrabold">{inr(q.grand_total)}</p>
              {q.total_discount > 0 && <p className="text-sm font-semibold text-mint-500">You save {inr(q.total_discount)}</p>}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={pdf} className={buttonClass("primary", "lg")}><Download className="h-5 w-5" /> Download PDF</a>
            <a href={`${pdf}?view=1`} target="_blank" rel="noreferrer" className={buttonClass("outline", "lg")}><Eye className="h-5 w-5" /> Open PDF</a>
            <a href={wa} target="_blank" rel="noreferrer" className={buttonClass("accent", "lg")}><MessageCircle className="h-5 w-5" /> Confirm on WhatsApp</a>
          </div>
          {isNew && (
            <p className="mt-5 rounded-2xl bg-brand-50 px-5 py-4 text-sm text-brand-700">
              Thank you! Our team has received your request and will call you on <b>{q.customer_phone}</b> shortly. For urgent queries call{" "}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 font-bold underline"><Phone className="h-3.5 w-3.5" />{site.phone}</a>.
            </p>
          )}

          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-ink text-left text-white">
                <tr>
                  <th className="px-4 py-3">#</th><th className="px-4 py-3">Item</th><th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">MRP</th><th className="px-4 py-3 text-right">Rate</th><th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {q.items.map((i, n) => (
                  <tr key={n} className="even:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400">{n + 1}</td>
                    <td className="px-4 py-3"><b>{i.name}</b><div className="text-xs text-slate-500">{i.description}</div></td>
                    <td className="px-4 py-3 text-center">{i.qty}</td>
                    <td className="px-4 py-3 text-right text-slate-400 line-through">{inr(i.mrp)}</td>
                    <td className="px-4 py-3 text-right">{inr(i.unit_price)}</td>
                    <td className="px-4 py-3 text-right font-bold">{inr(i.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <iframe src={`${pdf}?view=1#toolbar=0&view=FitH`} title="Quotation PDF" className="h-[820px] w-full" />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Need changes? <Link href="/products" className="font-semibold text-brand-600 hover:underline">Build a new quotation</Link>
        </p>
      </div>
    </section>
  );
}
