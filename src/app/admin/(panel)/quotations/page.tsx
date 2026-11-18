import { Download, ExternalLink } from "lucide-react";
import { AdminHeader } from "../AdminHeader";
import { listQuotations } from "@/lib/db";
import { fmtDateTime, inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function QuotationsPage() {
  const quotes = await listQuotations();
  return (
    <>
      <AdminHeader title="Quotations" sub="Every quotation generated from the website." />
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-3">Quote no.</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Items</th><th className="px-5 py-3 text-right">Total</th><th className="px-5 py-3">Date</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-slate-500">No quotations yet.</td></tr>}
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-mono font-semibold">{q.quote_no}</td>
                <td className="px-5 py-4"><b>{q.customer_name}</b><div className="font-mono text-xs text-slate-500">{q.customer_phone}</div></td>
                <td className="max-w-xs px-5 py-4 text-slate-500"><span className="line-clamp-2">{q.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</span></td>
                <td className="px-5 py-4 text-right font-bold">{inr(q.grand_total)}</td>
                <td className="px-5 py-4 text-slate-500">{fmtDateTime(q.created_at)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <a href={`/quotation/${q.id}`} target="_blank" className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 hover:bg-slate-200" title="Open"><ExternalLink className="h-4 w-4" /></a>
                    <a href={`/api/quotations/${q.id}/pdf`} className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100" title="Download PDF"><Download className="h-4 w-4" /></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
