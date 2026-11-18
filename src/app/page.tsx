import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { QuoteSteps } from "@/components/home/QuoteSteps";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { categoryCounts } from "@/lib/counts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { all, counts } = await categoryCounts();
  const latest = all.slice(0, 8);
  const deals = [...all].sort((a, b) => b.discount - a.discount).filter((p) => p.discount > 0).slice(0, 4);

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid counts={counts} />

      {latest.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="container">
            <SectionHeading
              eyebrow="Just arrived"
              title="Latest in store"
              sub="Fresh stock added by our team — add to your quotation in one tap."
              action={<LinkButton href="/products" variant="outline">View all <ArrowRight className="h-4 w-4" /></LinkButton>}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((p) => <ProductCard key={p.id} product={p} showCategory />)}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-ink py-20 md:py-28">
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="container relative">
          <SectionHeading dark eyebrow="What we do" title="One shop for security & computing" sub="From a single camera to a complete office setup — sales, installation and after-sales service by the same trusted team." action={<LinkButton href="/services" variant="accent">All services <ArrowRight className="h-4 w-4" /></LinkButton>} />
          <ServicesGrid dark />
        </div>
      </section>

      {deals.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container">
            <SectionHeading eyebrow="Top discounts" title={<>Biggest savings <span className="text-accent-600">right now</span></>} />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {deals.map((p) => <ProductCard key={p.id} product={p} showCategory />)}
            </div>
          </div>
        </section>
      )}

      <QuoteSteps />
      <BrandMarquee />

      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="FAQ" title="Questions people ask us" sub="Can't find your answer? Call or WhatsApp us — we reply fast." />
          </div>
          <Faq />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
