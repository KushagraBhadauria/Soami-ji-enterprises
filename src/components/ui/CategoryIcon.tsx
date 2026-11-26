import { Cctv, Laptop, Cable, Mouse, Printer, ShieldCheck } from "lucide-react";
import type { LucideProps } from "lucide-react";

const map = { cctv: Cctv, laptop: Laptop, cable: Cable, mouse: Mouse, printer: Printer, shield: ShieldCheck };
export function CategoryIcon({ icon, ...p }: { icon: keyof typeof map } & LucideProps) {
  const I = map[icon];
  return <I {...p} />;
}
