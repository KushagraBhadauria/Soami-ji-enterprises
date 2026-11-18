import { LinkButton } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
      <LinkButton href="/" className="mt-8">Back to home</LinkButton>
    </section>
  );
}
