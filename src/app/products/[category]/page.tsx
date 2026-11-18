import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductBrowser } from "@/components/products/ProductBrowser";
import { categoryCounts } from "@/lib/counts";
import { categoryBySlug } from "@/lib/site";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = categoryBySlug((await params).category);
  return { title: c?.title ?? "Products" };
}

export default async function CategoryPage({ params }: P) {
  const slug = (await params).category;
  const cat = categoryBySlug(slug);
  if (!cat) notFound();
  const { all, counts } = await categoryCounts();
  const list = all.filter((p) => p.category === cat.slug);
  return (
    <>
      <PageHero crumb={cat.title} eyebrow="Catalogue" title={cat.title} sub={cat.blurb} />
      <section className="bg-slate-50/60 py-12 md:py-16">
        <div className="container">
          <CategoryTabs active={cat.slug} counts={counts} />
          <ProductBrowser products={list} />
        </div>
      </section>
    </>
  );
}
