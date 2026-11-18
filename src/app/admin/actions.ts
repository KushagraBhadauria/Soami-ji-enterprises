"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-guard";
import { createProduct, deleteProduct, updateProduct, uploadImage } from "@/lib/db";
import { categories, units, type Category } from "@/lib/site";

export async function login(_: unknown, fd: FormData) {
  const pw = String(fd.get("password") ?? "");
  if (pw !== (process.env.ADMIN_PASSWORD || "admin123")) return { error: "Wrong password" };
  (await cookies()).set(ADMIN_COOKIE, await adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  const next = String(fd.get("next") || "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export type SaveState = { ok?: boolean; error?: string; name?: string };

export async function saveProduct(_: SaveState, fd: FormData): Promise<SaveState> {
  await requireAdmin();
  const category = String(fd.get("category")) as Category;
  const name = String(fd.get("name") ?? "").trim();
  const description = String(fd.get("description") ?? "").trim();
  const location = String(fd.get("location") ?? "").trim();
  const mrp = Number(fd.get("mrp"));
  const discount = Number(fd.get("discount") || 0);
  const condition = fd.get("condition") === "used" ? "used" : "new";
  const unitRaw = String(fd.get("unit") || "PCS");
  const unit = (units as readonly string[]).includes(unitRaw) ? unitRaw : "PCS";
  const image = fd.get("image") as File | null;

  if (!categories.some((c) => c.slug === category)) return { error: "Choose a catalogue" };
  if (!name) return { error: "Product name is required" };
  if (!(mrp > 0)) return { error: "Enter a valid MRP" };
  if (discount < 0 || discount > 100) return { error: "Discount must be between 0 and 100%" };
  if (!image || image.size === 0) return { error: "Please choose a product photo" };
  if (image.size > 4 * 1024 * 1024) return { error: "Photo is too large (max 4 MB)" };
  if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(image.type)) return { error: "Photo must be JPG, PNG or WEBP" };

  try {
    const image_url = await uploadImage(image);
    await createProduct({ category, name, description, location, mrp, discount, condition, unit, image_url });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save product" };
  }
  revalidatePath("/", "layout");
  return { ok: true, name };
}

export async function removeProduct(fd: FormData) {
  await requireAdmin();
  await deleteProduct(String(fd.get("id")));
  revalidatePath("/", "layout");
}

export async function toggleProduct(fd: FormData) {
  await requireAdmin();
  await updateProduct(String(fd.get("id")), { active: fd.get("active") === "true" });
  revalidatePath("/", "layout");
}
