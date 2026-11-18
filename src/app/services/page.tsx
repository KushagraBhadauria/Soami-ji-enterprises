import type { Metadata } from "next";
import { Building2, Factory, GraduationCap, Home, Store, Warehouse } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/home/CtaBand";
import { QuoteSteps } from "@/components/home/QuoteSteps";

export const metadata: Metadata = { title: "Services" };

const sectors = [
  { icon: Home, t: "Homes & flats" },
  { icon: Store, t: "Shops & showrooms" },
  { icon: Building2, t: "Offices" },
  { icon: GraduationCap, t: "Schools & coaching" },
  { icon: Factory, t: "Factories" },
  { icon: Warehouse, t: "Warehouses & godowns" },
];

const process = [
  { t: "Free site survey", d: "We visit, understand your needs and check coverage points, wiring paths and storage." },
  { t: "Clear quotation", d: "You get a written quotation with product, quantity and price — no hidden charges." },
  { t: "Neat installation", d: "Concealed or conduit wiring, proper mounting and labelled DVR/NVR setup." },
  { t: "Mobile setup & training", d: "Live view on your phone, playback and backup — we show you how everything works." },
  { t: "After-sales service", d: "Breakdown support and yearly AMC so your system keeps recording, always." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero crumb="Services" eyebrow="Services" title={<>Installation, repair & <span className="text-accent-400">after-sales care</span></>} sub="Whoever installed your cameras, whichever brand your laptop is — we can set it up, fix it and keep it running." />
      <section className="py-20 md:py-28">
        <div className="container">
          <ServicesGrid />
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="How we install CCTV" title="A simple, transparent process" />
            <ol className="relative space-y-8 border-l-2 border-brand-100 pl-8">
              {process.map((p, i) => (
                <li key={p.t} className="relative">
                  <span className="absolute -left-[45px] grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white ring-4 ring-slate-50">{i + 1}</span>
                  <h3 className="font-display text-lg font-bold">{p.t}</h3>
                  <p className="mt-1 text-slate-600">{p.d}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="Who we serve" title="Security for every space" />
            <div className="grid grid-cols-2 gap-4">
              {sectors.map(({ icon: I, t }) => (
                <div key={t} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <I className="h-7 w-7 text-brand-600" />
                  <span className="font-bold">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <QuoteSteps />
      <CtaBand />
    </>
  );
}
