import clsx from "clsx";
import type { ReactNode } from "react";

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[.14em]",
        dark ? "bg-white/10 text-accent-400" : "bg-brand-50 text-brand-700"
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", dark ? "bg-accent-400" : "bg-brand-500")} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center,
  dark,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  dark?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className={clsx("mb-10 flex flex-col gap-4 md:mb-14", center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between")}>
      <div className={clsx("max-w-2xl", center && "mx-auto")}>
        {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        <h2 className={clsx("mt-4 font-display text-3xl font-extrabold tracking-tight md:text-[2.6rem] md:leading-[1.1]", dark ? "text-white" : "text-ink")}>
          {title}
        </h2>
        {sub && <p className={clsx("mt-4 text-base md:text-lg", dark ? "text-slate-300" : "text-slate-600")}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
