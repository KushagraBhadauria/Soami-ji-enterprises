import type { Metadata } from "next";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = { title: "Owner panel", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      <AdminNav />
      <div className="min-w-0 px-4 py-6 md:px-8 md:py-8">{children}</div>
    </div>
  );
}
