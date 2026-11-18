import { Phone } from "lucide-react";
import { LinkButton } from "../ui/Button";
import { site } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-indigo-800 px-6 py-14 text-white md:px-14">
          <div className="grid-bg absolute inset-0 opacity-70" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Planning CCTV for your home or shop?</h2>
              <p className="mt-3 text-lg text-white/80">Book a free site survey. We&apos;ll suggest the right cameras, placement and budget — no obligation.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi, I want a free CCTV site survey.")}`} external variant="accent" size="lg">
                Book free survey
              </LinkButton>
              <LinkButton href={`tel:${site.phone.replace(/\s/g, "")}`} external variant="white" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20">
                <Phone className="h-5 w-5" /> Call now
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
