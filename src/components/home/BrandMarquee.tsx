import { brands } from "@/lib/content";

export function BrandMarquee() {
  const row = [...brands, ...brands];
  return (
    <section className="border-y border-slate-100 bg-white py-10">
      <p className="mb-6 text-center text-xs font-bold uppercase tracking-[.2em] text-slate-400">We sell & service all major brands</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-14">
          {row.map((b, i) => (
            <span key={i} className="font-display text-2xl font-extrabold tracking-tight text-slate-300">{b}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </section>
  );
}
