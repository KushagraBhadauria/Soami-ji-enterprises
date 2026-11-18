import { BadgePercent, Headset, Recycle, Truck } from "lucide-react";

const items = [
  { icon: BadgePercent, title: "Great discounts", text: "Best prices on every product" },
  { icon: Recycle, title: "New + second-hand", text: "Tested refurbished stock" },
  { icon: Truck, title: "Doorstep service", text: "Installation at your site" },
  { icon: Headset, title: "After-sales support", text: "We're a call away" },
];

export function TrustStrip() {
  return (
    <section className="relative z-10 -mt-px border-b border-slate-100 bg-white">
      <div className="container grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
        {items.map(({ icon: I, title, text }) => (
          <div key={title} className="flex items-center gap-4 px-2 py-7 md:px-6">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <I className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-bold text-ink">{title}</span>
              <span className="block text-sm text-slate-500">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
