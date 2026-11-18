import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Lead, Product, ProductInput, Quotation, QuoteItem } from "./types";
import type { Category } from "./site";
import { site } from "./site";

/**
 * Data layer.
 *  - If SUPABASE env vars are set → uses Supabase (Postgres + Storage).
 *  - Otherwise → "demo mode": JSON files in /data and images in /public/uploads,
 *    so the site runs locally with zero setup.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-images";

export const usingSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

let _sb: SupabaseClient | null = null;
function sb() {
  if (!_sb) _sb = createClient(SUPABASE_URL!, SUPABASE_KEY!, { auth: { persistSession: false } });
  return _sb;
}

/* ---------------- local JSON fallback ---------------- */
const DATA_DIR = path.join(process.cwd(), "data");
async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}
async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}
const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

/* ---------------- Images ---------------- */
export async function uploadImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  if (usingSupabase) {
    const { error } = await sb().storage.from(BUCKET).upload(name, buf, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (error) throw new Error("Image upload failed: " + error.message);
    return sb().storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buf);
  return `/uploads/${name}`;
}

/* ---------------- Products ---------------- */
export async function listProducts(opts: { category?: Category; includeInactive?: boolean; limit?: number } = {}) {
  if (usingSupabase) {
    let q = sb().from("products").select("*").order("created_at", { ascending: false });
    if (opts.category) q = q.eq("category", opts.category);
    if (!opts.includeInactive) q = q.eq("active", true);
    if (opts.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(normalizeProduct);
  }
  let all = (await readJson<Product[]>("products.json", [])).map((p) => ({ ...p, unit: p.unit || "PCS" }));
  all = all.sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (opts.category) all = all.filter((p) => p.category === opts.category);
  if (!opts.includeInactive) all = all.filter((p) => p.active);
  if (opts.limit) all = all.slice(0, opts.limit);
  return all;
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  if (usingSupabase) {
    const { data, error } = await sb().from("products").select("*").in("id", ids);
    if (error) throw error;
    return (data ?? []).map(normalizeProduct);
  }
  const all = await readJson<Product[]>("products.json", []);
  return all.filter((p) => ids.includes(p.id));
}

export async function createProduct(input: ProductInput) {
  const row = { ...input, active: input.active ?? true };
  if (usingSupabase) {
    const { data, error } = await sb().from("products").insert(row).select().single();
    if (error) throw error;
    return normalizeProduct(data);
  }
  const all = await readJson<Product[]>("products.json", []);
  const p: Product = { ...row, id: uid(), created_at: now(), active: row.active };
  all.push(p);
  await writeJson("products.json", all);
  return p;
}

export async function updateProduct(id: string, patch: Partial<ProductInput> & { active?: boolean }) {
  if (usingSupabase) {
    const { error } = await sb().from("products").update(patch).eq("id", id);
    if (error) throw error;
    return;
  }
  const all = await readJson<Product[]>("products.json", []);
  const i = all.findIndex((p) => p.id === id);
  if (i >= 0) {
    all[i] = { ...all[i], ...patch } as Product;
    await writeJson("products.json", all);
  }
}

export async function deleteProduct(id: string) {
  if (usingSupabase) {
    const { error } = await sb().from("products").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const all = await readJson<Product[]>("products.json", []);
  await writeJson("products.json", all.filter((p) => p.id !== id));
}

function normalizeProduct(r: Record<string, unknown>): Product {
  return { ...(r as unknown as Product), unit: (r.unit as string) || "PCS", mrp: Number(r.mrp), discount: Number(r.discount) };
}

/* ---------------- Leads (future customers) ---------------- */
export async function upsertLead(input: { name: string; phone: string; email?: string | null; address?: string | null }) {
  const phone = input.phone.replace(/[^\d+]/g, "");
  const ts = now();
  if (usingSupabase) {
    const { data: existing } = await sb().from("leads").select("*").eq("phone", phone).maybeSingle();
    if (existing) {
      const { data, error } = await sb()
        .from("leads")
        .update({
          name: input.name,
          email: input.email || existing.email,
          address: input.address || existing.address,
          quote_count: (existing.quote_count ?? 0) + 1,
          last_quote_at: ts,
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data as Lead;
    }
    const { data, error } = await sb()
      .from("leads")
      .insert({ name: input.name, phone, email: input.email || null, address: input.address || null, quote_count: 1, last_quote_at: ts })
      .select()
      .single();
    if (error) throw error;
    return data as Lead;
  }
  const all = await readJson<Lead[]>("leads.json", []);
  const ex = all.find((l) => l.phone === phone);
  if (ex) {
    ex.name = input.name;
    ex.email = input.email || ex.email;
    ex.address = input.address || ex.address;
    ex.quote_count += 1;
    ex.last_quote_at = ts;
    await writeJson("leads.json", all);
    return ex;
  }
  const lead: Lead = {
    id: uid(),
    name: input.name,
    phone,
    email: input.email || null,
    address: input.address || null,
    quote_count: 1,
    last_quote_at: ts,
    created_at: ts,
  };
  all.push(lead);
  await writeJson("leads.json", all);
  return lead;
}

export async function listLeads() {
  if (usingSupabase) {
    const { data, error } = await sb().from("leads").select("*").order("last_quote_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Lead[];
  }
  const all = await readJson<Lead[]>("leads.json", []);
  return all.sort((a, b) => (b.last_quote_at ?? "").localeCompare(a.last_quote_at ?? ""));
}

/* ---------------- Quotations ---------------- */
function financialYear(d = new Date()) {
  const y = d.getFullYear();
  const start = d.getMonth() >= 3 ? y : y - 1;
  return `${String(start % 100).padStart(2, "0")}-${String((start + 1) % 100).padStart(2, "0")}`;
}

export async function createQuotation(input: {
  lead: Lead;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  items: QuoteItem[];
}): Promise<Quotation> {
  const total_mrp = input.items.reduce((s, i) => s + i.mrp * i.qty, 0);
  const grand_total = input.items.reduce((s, i) => s + i.amount, 0);
  const base = {
    lead_id: input.lead.id,
    customer_name: input.lead.name,
    customer_phone: input.lead.phone,
    customer_email: input.email || input.lead.email || null,
    customer_address: input.address || input.lead.address || null,
    note: input.note || null,
    items: input.items,
    total_mrp,
    total_discount: total_mrp - grand_total,
    grand_total,
  };
  const fy = financialYear();

  if (usingSupabase) {
    const { data, error } = await sb().from("quotations").insert({ ...base, quote_no: "PENDING" }).select().single();
    if (error) throw error;
    const quote_no = `${site.quotation.prefix}/${fy}/${site.quotation.serialPrefix}${data.seq}`;
    await sb().from("quotations").update({ quote_no }).eq("id", data.id);
    return { ...(data as Quotation), quote_no };
  }
  const all = await readJson<Quotation[]>("quotations.json", []);
  const q: Quotation = {
    ...base,
    id: uid(),
    quote_no: `${site.quotation.prefix}/${fy}/${site.quotation.serialPrefix}${all.length + 1}`,
    created_at: now(),
  };
  all.push(q);
  await writeJson("quotations.json", all);
  return q;
}

export async function getQuotation(id: string) {
  if (usingSupabase) {
    const { data } = await sb().from("quotations").select("*").eq("id", id).maybeSingle();
    return (data as Quotation) ?? null;
  }
  const all = await readJson<Quotation[]>("quotations.json", []);
  return all.find((q) => q.id === id) ?? null;
}

export async function listQuotations() {
  if (usingSupabase) {
    const { data, error } = await sb().from("quotations").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw error;
    return (data ?? []) as Quotation[];
  }
  const all = await readJson<Quotation[]>("quotations.json", []);
  return all.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
