"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ExternalLink, FileText, ImagePlus, LayoutGrid, LogOut, Users } from "lucide-react";
import { LogoImage } from "@/components/layout/Logo";
import { logout } from "../actions";
import { site } from "@/lib/site";

const items = [
  { href: "/admin", label: "Products", icon: LayoutGrid },
  { href: "/admin/products/new", label: "Upload product", icon: ImagePlus },
  { href: "/admin/leads", label: "Future customers", icon: Users },
  { href: "/admin/quotations", label: "Quotations", icon: FileText },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 z-30 border-b border-white/10 bg-ink text-slate-300 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-4 lg:py-6">
        <LogoImage className="h-10 w-10" />
        <div className="leading-tight">
          <p className="font-display font-extrabold text-white">{site.shortName} Admin</p>
          <p className="text-xs text-slate-500">Owner panel</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 no-scrollbar lg:flex-col lg:pb-0">
        {items.map(({ href, label, icon: I }) => {
          const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link key={href} href={href} className={clsx("flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition", active ? "bg-brand-600 text-white" : "hover:bg-white/5 hover:text-white")}>
              <I className="h-[18px] w-[18px]" /> {label}
            </Link>
          );
        })}
        <div className="hidden lg:my-4 lg:block lg:border-t lg:border-white/10" />
        <Link href="/" target="_blank" className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-[18px] w-[18px]" /> View website
        </Link>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white">
            <LogOut className="h-[18px] w-[18px]" /> Log out
          </button>
        </form>
      </nav>
    </aside>
  );
}
