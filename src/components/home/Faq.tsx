import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/content";

export function Faq() {
  return (
    <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
      {faqs.map((f, i) => (
        <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
            {f.q}
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-slate-100 transition group-open:rotate-180 group-open:bg-brand-600 group-open:text-white">
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>
          <p className="mt-3 pr-10 leading-relaxed text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
