import type { Category } from "./site";

export type Condition = "new" | "used";

export interface Product {
  id: string;
  category: Category;
  name: string;
  description: string; // ~10–15 words, includes model number
  location: string;
  mrp: number;
  discount: number; // percent, 0–100
  condition: Condition;
  unit: string; // PCS, MTR, BDL…
  image_url: string;
  active: boolean;
  created_at: string;
}

export type ProductInput = Omit<Product, "id" | "created_at" | "active"> & { active?: boolean };

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  quote_count: number;
  last_quote_at: string | null;
  created_at: string;
}

export interface QuoteItem {
  product_id: string;
  name: string;
  description: string;
  category: Category;
  condition: Condition;
  unit: string;
  image_url: string;
  mrp: number;
  discount: number;
  unit_price: number;
  qty: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quote_no: string;
  lead_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  note: string | null;
  items: QuoteItem[];
  total_mrp: number;
  total_discount: number;
  grand_total: number;
  created_at: string;
}

export const priceAfterDiscount = (mrp: number, discount: number) =>
  Math.round(mrp * (1 - Math.min(Math.max(discount, 0), 100) / 100));
