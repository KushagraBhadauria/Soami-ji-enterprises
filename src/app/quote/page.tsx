import type { Metadata } from "next";
import { QuoteBuilder } from "./QuoteBuilder";

export const metadata: Metadata = { title: "Get quotation" };

export default function QuotePage() {
  return (
    <section className="grid-bg-light min-h-[70vh] bg-slate-50 py-12 md:py-16">
      <div className="container">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Get your quotation</h1>
          <p className="mt-2 text-slate-600">Review your items, adjust quantities and generate a PDF quotation instantly.</p>
        </div>
        <QuoteBuilder />
      </div>
    </section>
  );
}
