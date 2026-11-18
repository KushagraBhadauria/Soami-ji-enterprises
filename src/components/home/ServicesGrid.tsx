import { Check } from "lucide-react";
import { services } from "@/lib/content";
import { ServiceIcon } from "../ui/ServiceIcon";

export function ServicesGrid({ dark }: { dark?: boolean }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <div key={s.title} className={dark ? "group rounded-3xl border border-white/10 bg-white/[.04] p-7 transition hover:border-white/20 hover:bg-white/[.07]" : "group rounded-3xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:shadow-lift"}>
          <span className={dark ? "grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white" : "grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"}>
            <ServiceIcon name={s.icon} className="h-7 w-7" />
          </span>
          <h3 className={`mt-6 font-display text-xl font-bold ${dark ? "text-white" : "text-ink"}`}>{s.title}</h3>
          <p className={`mt-2.5 text-[15px] leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>{s.text}</p>
          <ul className="mt-5 space-y-2">
            {s.points.map((p) => (
              <li key={p} className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
                <Check className="h-4 w-4 text-mint-500" /> {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
