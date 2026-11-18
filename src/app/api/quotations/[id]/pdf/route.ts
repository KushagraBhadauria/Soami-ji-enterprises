import { getQuotation } from "@/lib/db";
import { renderQuotationPdf } from "@/lib/quotation-pdf";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = await getQuotation(id);
  if (!q) return new Response("Quotation not found", { status: 404 });
  const pdf = await renderQuotationPdf(q);
  const inline = new URL(req.url).searchParams.get("view") === "1";
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="Quotation-${q.quote_no.replace(/\//g, "-")}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
