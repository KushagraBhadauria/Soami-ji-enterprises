import type { ReactNode } from "react";
export function AdminHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-slate-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
