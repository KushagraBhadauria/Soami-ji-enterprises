import { Download, MessageCircle, Phone } from "lucide-react";
import { AdminHeader } from "../AdminHeader";
import { listLeads } from "@/lib/db";
import { fmtDateTime } from "@/lib/format";
import { buttonClass } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await listLeads();
  return (
    <>
      <AdminHeader
        title="Future customers"
        sub="Everyone who generated a quotation. Saved automatically with name and mobile number."
        action={<a href="/api/admin/leads-csv" className={buttonClass("outline", "md")}><Download className="h-4 w-4" /> Export to Excel (CSV)</a>}
      />
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Mobile</th><th className="px-5 py-3">Email / Address</th><th className="px-5 py-3 text-center">Quotes</th><th className="px-5 py-3">Last quote</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-slate-500">No customers yet — they appear here as soon as someone generates a quotation.</td></tr>}
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-bold">{l.name}</td>
                <td className="px-5 py-4 font-mono">{l.phone}</td>
                <td className="px-5 py-4 text-slate-500">{l.email || "—"}{l.address && <div className="text-xs">{l.address}</div>}</td>
                <td className="px-5 py-4 text-center"><span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">{l.quote_count}</span></td>
                <td className="px-5 py-4 text-slate-500">{l.last_quote_at ? fmtDateTime(l.last_quote_at) : "—"}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <a href={`tel:${l.phone}`} className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 hover:bg-slate-200" title="Call"><Phone className="h-4 w-4" /></a>
                    <a href={`https://wa.me/91${l.phone.slice(-10)}`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366]/15 text-[#128C7E] hover:bg-[#25D366]/25" title="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
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
