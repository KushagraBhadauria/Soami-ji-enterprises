import Link from "next/link";
import clsx from "clsx";
import { site } from "@/lib/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#1A63E6" />
      <circle cx="20" cy="20" r="10.5" fill="none" stroke="#fff" strokeWidth="2.6" />
      <circle cx="20" cy="20" r="4.6" fill="#FF9F1C" />
      <circle cx="22" cy="18" r="1.4" fill="#fff" />
      <path d="M8 31.5h24" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LogoImage({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={site.logo} alt={site.brand} className={clsx("rounded-full object-cover ring-2 ring-amber-500/40", className)} />;
}

export function Logo({ dark }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={site.name}>
      <LogoImage className="h-11 w-11 flex-none" />
      <span className="leading-none">
        <span className={clsx("block font-display text-[1.15rem] font-extrabold tracking-tight", dark ? "text-white" : "text-ink")}>{site.name}</span>
        <span className={clsx("mt-1 hidden text-[10.5px] sm:block font-semibold uppercase tracking-[.16em]", dark ? "text-slate-400" : "text-slate-500")}>
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
