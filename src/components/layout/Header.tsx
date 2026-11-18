"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, FileText, Menu, Phone, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import { useCart } from "../cart/CartProvider";
import { categories, site } from "@/lib/site";
import { CategoryIcon } from "../ui/CategoryIcon";

const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products", mega: true },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const path = usePathname();
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => setMobile(false), [path]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!count) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(t);
  }, [count]);

  if (path.startsWith("/admin")) return null;
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <>
      <div className="hidden bg-ink text-[13px] text-slate-300 md:block">
        <div className="container flex h-9 items-center justify-between">
          <span>
            <span className="font-semibold text-accent-400">Free site survey</span> for CCTV installation • New & second-hand products with great discounts
          </span>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-white">
            <Phone className="h-3.5 w-3.5" /> {site.phone}
          </a>
        </div>
      </div>
      <header className={clsx("sticky top-0 z-50 border-b bg-white/85 backdrop-blur-xl transition-shadow", scrolled ? "border-slate-200 shadow-[0_6px_24px_-12px_rgba(11,18,32,.18)]" : "border-transparent")}>
        <div className="container flex h-[72px] items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) =>
              n.mega ? (
                <div key={n.href} className="group relative">
                  <Link href={n.href} className={clsx("flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] font-semibold transition", active(n.href) ? "text-brand-600" : "text-slate-700 hover:text-ink")}>
                    {n.label} <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-lift">
                      {categories.map((c) => (
                        <Link key={c.slug} href={`/products/${c.slug}`} className="flex gap-3 rounded-xl p-3 hover:bg-slate-50 [&:last-child:nth-child(odd)]:col-span-2">
                          <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-brand-50 text-brand-600">
                            <CategoryIcon icon={c.icon} className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-ink">{c.title}</span>
                            <span className="mt-0.5 block text-xs leading-snug text-slate-500">{c.blurb}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={n.href} href={n.href} className={clsx("rounded-lg px-3.5 py-2 text-[15px] font-semibold transition", active(n.href) ? "text-brand-600" : "text-slate-700 hover:text-ink")}>
                  {n.label}
                </Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className={clsx(
                "relative flex h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink-700",
                bump && "scale-105"
              )}
            >
              <FileText className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">Quotation</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-extrabold text-ink ring-2 ring-white">
                  {count}
                </span>
              )}
            </button>
            <button onClick={() => setMobile((v) => !v)} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 lg:hidden" aria-label="Menu">
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobile && (
          <div className="border-t border-slate-100 bg-white lg:hidden">
            <nav className="container flex flex-col py-3">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className={clsx("rounded-lg px-3 py-3 font-semibold", active(n.href) ? "bg-brand-50 text-brand-700" : "text-slate-700")}>
                  {n.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/products/${c.slug}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-semibold [&:last-child:nth-child(odd)]:col-span-2">
                    <CategoryIcon icon={c.icon} className="h-4 w-4 text-brand-600" /> {c.short}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
