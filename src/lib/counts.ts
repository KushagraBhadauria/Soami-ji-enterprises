import "server-only";
import { listProducts } from "./db";

export async function categoryCounts() {
  const all = await listProducts();
  const counts: Record<string, number> = {};
  for (const p of all) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return { all, counts };
}
