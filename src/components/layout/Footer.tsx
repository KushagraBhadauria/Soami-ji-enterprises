"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { categories, site } from "@/lib/site";

export function Footer() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <footer className="relative overflow-hidden bg-ink text-slate-300">
      <div className="grid-bg absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container relative grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{site.description}</p>
          {site.gstin && <p className="mt-4 text-xs text-slate-500">GSTIN {site.gstin}</p>}
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Products</h4>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/products/${c.slug}`} className="hover:text-white">{c.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/about" className="hover:text-white">About us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/quote" className="hover:text-white">Get a quotation</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Visit / Call</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 flex-none text-accent-400" />{site.address}</li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 flex-none text-accent-400" /><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 flex-none text-accent-400" /><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
            <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 flex-none text-accent-400" />{site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 md:flex-row">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>CCTV Installation • Laptop & Computer Sales • Repair & Service</span>
        </div>
      </div>
    </footer>
  );
}
