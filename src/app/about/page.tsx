import type { Metadata } from "next";
import { HandCoins, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/home/CtaBand";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About us" };

const values = [
  { icon: ShieldCheck, t: "Honest advice", d: "We recommend what you actually need — not the most expensive option." },
  { icon: HandCoins, t: "Fair prices", d: "Clear MRP and discount on every product, and a written quotation every time." },
  { icon: HeartHandshake, t: "Service after sale", d: "Our relationship starts after the sale. Call us and we'll be there." },
  { icon: Sparkles, t: "Quality checked", d: "Every second-hand product is tested and cleaned before it reaches you." },
];

export default function AboutPage() {
  const years = new Date().getFullYear() - site.established;
  return (
    <>
      <PageHero crumb="About" eyebrow="About us" title={<>Your neighbourhood experts in <span className="text-accent-400">security & computers</span></>} sub={`Serving homes and businesses since ${site.established}.`} />

      <section className="py-20 md:py-28">
        <div className="container grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our story" title="An all-rounder you can trust" />
            <div className="space-y-4 text-lg leading-relaxed text-slate-600">
              <p>
                {site.name} started with a simple idea: people should be able to buy, install and repair their cameras and computers from one place they trust. Today we sell CCTV cameras, laptops, computers and accessories — both new and second-hand — and we handle installation and service ourselves.
              </p>
              <p>
                We don&apos;t only look after systems we installed. If someone else set up your cameras, or your laptop is from a brand we don&apos;t sell, bring it to us — we&apos;ll fix it and keep it running.
              </p>
              <p>
                Good discounts, clear quotations and fast after-sales support are why customers keep coming back and recommending us to their friends and family.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: `${years}+`, v: "Years of experience" },
              { k: "4", v: "Product catalogues" },
              { k: "All", v: "Major brands serviced" },
              { k: "1", v: "Call for everything" },
            ].map((s, i) => (
              <div key={s.v} className={`rounded-3xl p-7 ${i === 0 ? "bg-brand-600 text-white" : i === 3 ? "bg-accent-500 text-ink" : "border border-slate-200 bg-white shadow-card"}`}>
                <div className="font-display text-5xl font-extrabold">{s.k}</div>
                <div className={`mt-2 font-semibold ${i === 0 ? "text-white/80" : i === 3 ? "text-ink/70" : "text-slate-500"}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container">
          <SectionHeading center eyebrow="What we stand for" title="Our promise to every customer" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><I className="h-6 w-6" /></span>
                <h3 className="mt-5 font-display text-lg font-bold">{t}</h3>
                <p className="mt-2 text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BrandMarquee />
      <CtaBand />
    </>
  );
}
