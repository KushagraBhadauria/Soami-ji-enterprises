import { ArrowRight, BadgeCheck, FileText, ShieldCheck, Wifi } from "lucide-react";
import { LinkButton } from "../ui/Button";
import { Eyebrow } from "../ui/SectionHeading";
import { site } from "@/lib/site";

function CameraFeed({ label, hue, delay }: { label: string; hue: string; delay: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-ink-800" style={{ animationDelay: delay }}>
      <div className="absolute inset-0 opacity-80" style={{ background: hue }} />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.04)_0_1px,transparent_1px_3px)]" />
      <div className="relative flex h-full flex-col justify-between p-2">
        <div className="flex items-center justify-between text-[9px] font-semibold text-white/80">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />REC</span>
          <span>{label}</span>
        </div>
        <div className="text-[9px] font-mono text-white/60">HD 1080p</div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-brand-600/25 blur-3xl" />
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl" />

      <div className="container relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-fade-up">
          <Eyebrow dark>{site.tagline}</Eyebrow>
          <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.1rem]">
            Cameras & computers —{" "}
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-accent-400 bg-clip-text text-transparent">sold, installed & serviced.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            CCTV installation and repair, new and second-hand laptops, computers and accessories — with honest advice and great discounts. Build your list and get a quotation in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/products" variant="accent" size="lg">
              Browse products <ArrowRight className="h-5 w-5" />
            </LinkButton>
            <LinkButton href="/quote" variant="white" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20">
              <FileText className="h-5 w-5" /> Get instant quotation
            </LinkButton>
          </div>
          <ul className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-300">
            {["Free CCTV site survey", "Service for any installer", "New & second-hand stock", "Doorstep support"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 flex-none text-mint-500" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: monitor with live feeds */}
        <div className="relative mx-auto w-full max-w-[520px] animate-fade-up [animation-delay:.15s]">
          <div className="rounded-[22px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-ink-800 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Wifi className="h-3.5 w-3.5 text-mint-500" /> 4 cameras online
                </span>
              </div>
              <div className="grid aspect-[16/10] grid-cols-2 grid-rows-2 gap-2">
                <CameraFeed label="CAM 01 · Gate" hue="linear-gradient(135deg,#1e3a8a,#0f172a 70%)" delay="0s" />
                <CameraFeed label="CAM 02 · Shop" hue="linear-gradient(135deg,#0e7490,#0f172a 70%)" delay=".2s" />
                <CameraFeed label="CAM 03 · Parking" hue="linear-gradient(135deg,#334155,#0f172a 70%)" delay=".4s" />
                <CameraFeed label="CAM 04 · Office" hue="linear-gradient(135deg,#4c1d95,#0f172a 70%)" delay=".6s" />
              </div>
            </div>
          </div>
          <div className="mx-auto h-6 w-28 rounded-b-xl bg-white/10" />
          <div className="mx-auto h-2 w-48 rounded-full bg-white/10" />

          {/* floating cards */}
          <div className="absolute -left-4 top-10 hidden rounded-2xl border border-white/10 bg-white p-3 text-ink shadow-lift sm:flex sm:items-center sm:gap-3 md:-left-10">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint-500/15 text-mint-500"><ShieldCheck className="h-5 w-5" /></span>
            <span>
              <span className="block text-xs text-slate-500">Home secured</span>
              <span className="block text-sm font-bold">24×7 monitoring</span>
            </span>
          </div>
          <div className="absolute -bottom-4 -right-2 rounded-2xl border border-white/10 bg-white p-3 text-ink shadow-lift md:-right-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-500/20 text-accent-600"><FileText className="h-5 w-5" /></span>
              <span>
                <span className="block text-xs text-slate-500">Quotation ready</span>
                <span className="block text-sm font-bold">7 cameras · PDF</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
