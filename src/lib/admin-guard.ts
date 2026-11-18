import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken } from "./auth";

export async function isAdmin() {
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(c && c === (await adminToken()));
}
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
