import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "accent" | "dark" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_8px_20px_-8px_rgba(26,99,230,.7)]",
  accent: "bg-accent-500 text-ink hover:bg-accent-400 shadow-[0_8px_20px_-8px_rgba(255,159,28,.8)]",
  dark: "bg-ink text-white hover:bg-ink-700",
  outline: "border border-slate-300 text-ink hover:border-ink hover:bg-slate-50",
  ghost: "text-ink hover:bg-slate-100",
  white: "bg-white text-ink hover:bg-slate-100",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-13 px-7 text-base gap-2.5 py-3.5",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra?: string) =>
  clsx(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    variants[variant],
    sizes[size],
    extra
  );

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  external,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (external)
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={buttonClass(variant, size, className)}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
