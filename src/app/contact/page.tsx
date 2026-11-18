import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const cards = [
    { icon: Phone, t: "Call us", v: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, t: "WhatsApp", v: "Chat with us", href: `https://wa.me/${site.whatsapp}` },
    { icon: Mail, t: "Email", v: site.email, href: `mailto:${site.email}` },
    { icon: Clock, t: "Shop hours", v: site.hours },
  ];
  return (
    <>
      <PageHero crumb="Contact" eyebrow="Contact" title="Let's talk" sub="Visit the shop, call, or send a WhatsApp — we usually reply within minutes during shop hours." />
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ icon: I, t, v, href }) => {
              const inner = (
                <>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><I className="h-6 w-6" /></span>
                  <span className="mt-4 block text-sm font-semibold text-slate-500">{t}</span>
                  <span className="mt-1 block break-words font-bold text-ink">{v}</span>
                </>
              );
              return href ? (
                <a key={t} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">{inner}</a>
              ) : (
                <div key={t} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">{inner}</div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card md:p-8">
              <h2 className="font-display text-2xl font-extrabold">Send us a message</h2>
              <p className="mb-6 mt-1 text-slate-500">Opens WhatsApp with your message ready to send.</p>
              <ContactForm />
            </div>
            <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
              <iframe title="Shop location" src={site.mapEmbedUrl} className="h-80 w-full flex-1 border-0 lg:h-auto" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="flex items-start gap-3 p-6">
                <MapPin className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                <div>
                  <p className="font-bold">{site.name}</p>
                  <p className="text-slate-600">{site.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
