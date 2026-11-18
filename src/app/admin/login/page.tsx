import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { LogoImage } from "@/components/layout/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Owner login", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <LogoImage className="h-14 w-14" />
        <h1 className="mt-5 font-display text-2xl font-extrabold">Owner panel</h1>
        <p className="mt-1 text-sm text-slate-500">{site.name} — manage products & customers</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
