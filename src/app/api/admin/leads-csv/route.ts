import { isAdmin } from "@/lib/admin-guard";
import { listLeads } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const leads = await listLeads();
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["Name", "Phone", "Email", "Address", "Quotations", "Last quotation", "First seen"],
    ...leads.map((l) => [l.name, l.phone, l.email, l.address, l.quote_count, l.last_quote_at, l.created_at]),
  ];
  return new Response(rows.map((r) => r.map(cell).join(",")).join("\n"), {
    headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="future-customers.csv"' },
  });
}
