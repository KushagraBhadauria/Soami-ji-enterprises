import { ArrowRight, FileDown, MousePointerClick, UserRound } from "lucide-react";
import { steps } from "@/lib/content";
import { SectionHeading } from "../ui/SectionHeading";
import { LinkButton } from "../ui/Button";

const icons = [MousePointerClick, UserRound, FileDown];

export function QuoteSteps() {
  return (
    <section className="grid-bg-light relative border-y border-slate-100 bg-slate-50 py-20 md:py-28">
      <div className="container">
        <SectionHeading center eyebrow="Instant quotation" title={<>Need 7 cameras? Get a quote <span className="text-brand-600">in 30 seconds.</span></>} sub="No waiting, no back-and-forth. Build your list and download a professional quotation right away." />
        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-10 hidden h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 md:block" />
          {steps.map((s, i) => {
            const I = icons[i];
            return (
              <div key={s.title} className="relative flex flex-col items-center text-center">
                <span className="relative grid h-20 w-20 place-items-center rounded-3xl border border-slate-200 bg-white text-brand-600 shadow-card">
                  <I className="h-8 w-8" />
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-accent-500 text-xs font-extrabold text-ink">{i + 1}</span>
                </span>
                <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 max-w-xs text-slate-600">{s.text}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <LinkButton href="/products/camera" size="lg">
            Start with cameras <ArrowRight className="h-5 w-5" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
