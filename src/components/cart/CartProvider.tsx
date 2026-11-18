"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";
import { priceAfterDiscount } from "@/lib/types";

export type CartLine = { product: Product; qty: number };

type Ctx = {
  lines: CartLine[];
  count: number;
  totalMrp: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "sjc-quote-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((p: Product, qty = 1) => {
    setLines((ls) => {
      const i = ls.findIndex((l) => l.product.id === p.id);
      if (i >= 0) {
        const c = [...ls];
        c[i] = { product: p, qty: Math.min(c[i].qty + qty, 999) };
        return c;
      }
      return [...ls, { product: p, qty }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.product.id !== id) : ls.map((l) => (l.product.id === id ? { ...l, qty: Math.min(qty, 999) } : l))));
  }, []);
  const remove = useCallback((id: string) => setLines((ls) => ls.filter((l) => l.product.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const totalMrp = lines.reduce((n, l) => n + l.product.mrp * l.qty, 0);
    const total = lines.reduce((n, l) => n + priceAfterDiscount(l.product.mrp, l.product.discount) * l.qty, 0);
    return {
      lines, count, totalMrp, total, open, setOpen, add, setQty, remove, clear,
      qtyOf: (id) => lines.find((l) => l.product.id === id)?.qty ?? 0,
    };
  }, [lines, open, add, setQty, remove, clear]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
