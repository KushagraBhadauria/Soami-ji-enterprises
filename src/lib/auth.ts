/** Simple single-owner password auth for the /admin area (works in Edge + Node). */
export const ADMIN_COOKIE = "sjc_admin";

export async function adminToken(): Promise<string> {
  const pw = process.env.ADMIN_PASSWORD || "admin123";
  const secret = process.env.ADMIN_SECRET || "soamiji-change-me";
  const data = new TextEncoder().encode(`${pw}::${secret}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
