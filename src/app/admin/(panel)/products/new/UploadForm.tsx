"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, MapPin, Upload, X } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { saveProduct, type SaveState } from "../../../actions";
import { categories, units, type Category } from "@/lib/site";
import { priceAfterDiscount } from "@/lib/types";
import { inr } from "@/lib/format";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { buttonClass } from "@/components/ui/Button";

const empty = { name: "", description: "", location: "", mrp: "", discount: "" };

export function UploadForm({ defaultLocation }: { defaultLocation: string }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveProduct, {});
  const [category, setCategory] = useState<Category>("camera");
  const [condition, setCondition] = useState<"new" | "used">("new");
  const [v, setV] = useState({ ...empty, location: defaultLocation });
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const words = v.description.trim() ? v.description.trim().split(/\s+/).length : 0;
  const mrp = Number(v.mrp) || 0;
  const disc = Math.min(Math.max(Number(v.discount) || 0, 0), 100);
  const price = priceAfterDiscount(mrp, disc);

  useEffect(() => {
    if (state.ok) {
      toast.success("Product is live on the website", { description: state.name });
      setV((x) => ({ ...empty, location: x.location }));
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } else if (state.error) toast.error(state.error);
  }, [state]);

  const pickFile = async (raw?: File | null) => {
    if (!raw) return;
    if (!raw.type.startsWith("image/")) return toast.error("Please choose an image file");
    const f = await shrinkImage(raw);
    if (f.size > 4 * 1024 * 1024) return toast.error("Photo is too large — please choose a smaller one");
    const dt = new DataTransfer();
    dt.items.add(f);
    if (fileRef.current) fileRef.current.files = dt.files;
    setPreview(URL.createObjectURL(f));
  };

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={(e) => {
        if (!fileRef.current?.files?.length) {
          e.preventDefault();
          toast.error("Please add a product photo first");
        }
      }}
      className="grid gap-6 xl:grid-cols-[1fr_340px]"
    >
      <div className="space-y-6">
        {/* 1. Catalogue */}
        <Card step={1} title="Choose catalogue">
          <input type="hidden" name="category" value={category} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((c) => (
              <button type="button" key={c.slug} onClick={() => setCategory(c.slug)} className={clsx("flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center text-sm font-bold transition", category === c.slug ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                <CategoryIcon icon={c.icon} className="h-7 w-7" />
                {c.title}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input type="hidden" name="condition" value={condition} />
            {(["new", "used"] as const).map((c) => (
              <button type="button" key={c} onClick={() => setCondition(c)} className={clsx("rounded-xl px-4 py-2 text-sm font-semibold transition", condition === c ? "bg-ink text-white" : "bg-slate-100 text-slate-600")}>
                {c === "new" ? "New" : "Second-hand"}
              </button>
            ))}
          </div>
        </Card>

        {/* 2. Photo */}
        <Card step={2} title="Product photo">
          <input ref={fileRef} type="file" name="image" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
          {preview ? (
            <div className="relative flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="max-h-full max-w-full object-contain p-3" />
              <button type="button" onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ""; }} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow" aria-label="Remove photo">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0]); }}
              className={clsx("flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition", drag ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50 hover:border-brand-400")}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-card"><ImagePlus className="h-7 w-7" /></span>
              <span className="font-bold">Tap to take / choose a photo</span>
              <span className="text-sm text-slate-500">or drag & drop · JPG, PNG, WEBP · auto-resized</span>
            </button>
          )}
        </Card>

        {/* 3. Details */}
        <Card step={3} title="Product details">
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Product name <span className="text-red-500">*</span></label>
              <input id="name" name="name" required className="input" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder="e.g. CP Plus 2MP Dome Camera" />
            </div>
            <div>
              <label className="label" htmlFor="description">Short description <span className="font-normal text-slate-400">(10–15 words, include model number)</span></label>
              <textarea id="description" name="description" rows={2} className="input resize-none" value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} placeholder="Model CP-UNC-DA21PL3 · 2MP full HD, night vision 20m, indoor, 1-year warranty" />
              <p className={clsx("mt-1 text-xs font-semibold", words === 0 ? "text-slate-400" : words >= 10 && words <= 15 ? "text-mint-500" : "text-accent-600")}>
                {words} words {words > 0 && (words < 10 ? "· a little more detail helps" : words > 15 ? "· try to keep it short" : "· perfect")}
              </p>
            </div>
            <div>
              <label className="label" htmlFor="location">Location</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="location" name="location" className="input pl-10" value={v.location} onChange={(e) => setV({ ...v, location: e.target.value })} placeholder="e.g. Main shop, Kanpur" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="mrp">MRP (₹) <span className="text-red-500">*</span></label>
                <input id="mrp" name="mrp" required type="number" min={1} step="1" inputMode="numeric" className="input" value={v.mrp} onChange={(e) => setV({ ...v, mrp: e.target.value })} placeholder="2499" />
              </div>
              <div>
                <label className="label" htmlFor="discount">Discount (%)</label>
                <input id="discount" name="discount" type="number" min={0} max={100} step="0.5" inputMode="decimal" className="input" value={v.discount} onChange={(e) => setV({ ...v, discount: e.target.value })} placeholder="15" />
              </div>
              <div>
                <label className="label" htmlFor="unit">Unit</label>
                <select id="unit" name="unit" defaultValue="PCS" className="input">
                  {units.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            {mrp > 0 && (
              <div className="flex items-center justify-between rounded-2xl bg-mint-500/10 px-4 py-3 text-sm">
                <span className="font-semibold text-slate-600">Customer pays</span>
                <span>
                  <b className="font-display text-lg text-ink">{inr(price)}</b>
                  {disc > 0 && <span className="ml-2 text-slate-400 line-through">{inr(mrp)}</span>}
                </span>
              </div>
            )}
          </div>
        </Card>

        <button disabled={pending} className={buttonClass("primary", "lg", "w-full md:w-auto")}>
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {pending ? "Uploading…" : "Publish product"}
        </button>
        {state.ok && (
          <p className="flex items-center gap-2 text-sm font-semibold text-mint-500">
            <CheckCircle2 className="h-4 w-4" /> “{state.name}” is now live. Add the next one!
          </p>
        )}
      </div>

      {/* Live preview */}
      <div className="xl:sticky xl:top-8 xl:self-start">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Live preview</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="relative grid aspect-[4/3] place-items-center bg-gradient-to-br from-slate-50 to-slate-100">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-contain p-4" />
            ) : (
              <ImagePlus className="h-10 w-10 text-slate-300" />
            )}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {disc > 0 && <span className="rounded-lg bg-accent-500 px-2 py-1 text-xs font-extrabold">{disc}% OFF</span>}
              {condition === "used" && <span className="rounded-lg bg-ink px-2 py-1 text-[11px] font-bold uppercase text-white">Second-hand</span>}
            </div>
          </div>
          <div className="p-4">
            <p className="font-display font-bold">{v.name || "Product name"}</p>
            <p className="mt-1 text-sm text-slate-500">{v.description || "Short description with model number"}</p>
            {v.location && <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-brand-500" /> {v.location}</p>}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-xl font-extrabold">{mrp ? inr(price) : "₹—"}</span>
              {disc > 0 && mrp > 0 && <span className="text-sm text-slate-400 line-through">MRP {inr(mrp)}</span>}
            </div>
            <div className="mt-3 h-11 rounded-xl bg-brand-600/90" />
          </div>
        </div>
      </div>
    </form>
  );
}

/** Resize phone photos to max 1600px JPEG (~200–500 KB) so uploads are fast and fit hosting limits. */
async function shrinkImage(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function Card({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card md:p-6">
      <h2 className="mb-4 flex items-center gap-3 font-display text-lg font-bold">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-sm text-white">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
