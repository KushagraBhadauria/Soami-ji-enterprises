import { Cctv, Cpu, Laptop, Network, Recycle, Wrench, type LucideProps } from "lucide-react";
const map = { Cctv, Wrench, Laptop, Cpu, Recycle, Network };
export function ServiceIcon({ name, ...p }: { name: string } & LucideProps) {
  const I = map[name as keyof typeof map] ?? Wrench;
  return <I {...p} />;
}
