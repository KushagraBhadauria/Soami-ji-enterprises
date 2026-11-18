import { NextResponse } from "next/server";
import { createQuotation, getProductsByIds, upsertLead } from "@/lib/db";
import { renderQuotationPdf } from "@/lib/quotation-pdf";
import { notifyOwner } from "@/lib/mail";
import { priceAfterDiscount, type QuoteItem } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  items?: { id: string; qty: number }[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").replace(/[^\d]/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  const email = (body.email ?? "").trim() || null;
  if (name.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  if (!/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });

  const wanted = (body.items ?? []).filter((i) => i && typeof i.id === "string" && Number(i.qty) > 0);
  if (wanted.length === 0) return NextResponse.json({ error: "Your quotation list is empty" }, { status: 400 });

  // Always use prices from the database, never from the browser
  const products = await getProductsByIds(wanted.map((w) => w.id));
  const items: QuoteItem[] = wanted
    .map((w) => {
      const p = products.find((x) => x.id === w.id);
      if (!p) return null;
      const qty = Math.min(Math.max(Math.round(Number(w.qty)), 1), 999);
      const unit = priceAfterDiscount(p.mrp, p.discount);
      return {
        product_id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        condition: p.condition,
        unit: p.unit || "PCS",
        image_url: p.image_url,
        mrp: p.mrp,
        discount: p.discount,
        unit_price: unit,
        qty,
        amount: unit * qty,
      } satisfies QuoteItem;
    })
    .filter(Boolean) as QuoteItem[];
  if (items.length === 0) return NextResponse.json({ error: "Selected products are no longer available" }, { status: 400 });

  const lead = await upsertLead({ name, phone, email, address: body.address?.trim() || null });
  const quote = await createQuotation({
    lead,
    email,
    address: body.address?.trim() || null,
    note: body.note?.trim().slice(0, 500) || null,
    items,
  });

  // Owner email (don't fail the customer's request if mail fails)
  let mailed = false;
  try {
    const pdf = await renderQuotationPdf(quote);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    mailed = (await notifyOwner(quote, pdf, origin)).sent;
  } catch (e) {
    console.error("[quotation] owner email failed:", e);
  }

  return NextResponse.json({ id: quote.id, quote_no: quote.quote_no, mailed });
}
