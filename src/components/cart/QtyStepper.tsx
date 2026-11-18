"use client";
import { Minus, Plus } from "lucide-react";
import clsx from "clsx";

export function QtyStepper({ value, onChange, size = "md" }: { value: number; onChange: (n: number) => void; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-8" : "h-10";
  const w = size === "sm" ? "w-8" : "w-10";
  return (
    <div className={clsx("inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white", h)}>
      <button type="button" aria-label="Decrease" onClick={() => onChange(value - 1)} className={clsx("grid place-items-center text-slate-600 hover:bg-slate-100", h, w)}>
        <Minus className="h-4 w-4" />
      </button>
      <input
        aria-label="Quantity"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, "") || "0", 10);
          onChange(n);
        }}
        className={clsx("w-10 border-x border-slate-200 text-center text-sm font-bold text-ink outline-none", h)}
      />
      <button type="button" aria-label="Increase" onClick={() => onChange(value + 1)} className={clsx("grid place-items-center text-slate-600 hover:bg-slate-100", h, w)}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
