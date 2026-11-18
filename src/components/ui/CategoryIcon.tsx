import { Cctv, Laptop, Cable, Mouse, Printer } from "lucide-react";
import type { LucideProps } from "lucide-react";

const map = { cctv: Cctv, laptop: Laptop, cable: Cable, mouse: Mouse, printer: Printer };
export function CategoryIcon({ icon, ...p }: { icon: keyof typeof map } & LucideProps) {
  const I = map[icon];
  return <I {...p} />;
}
