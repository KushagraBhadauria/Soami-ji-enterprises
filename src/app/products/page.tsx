import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductBrowser } from "@/components/products/ProductBrowser";
import { categoryCounts } from "@/lib/counts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const { all, counts } = await categoryCounts();
  return (
    <>
      <PageHero crumb="Products" eyebrow="Our catalogue" title="Products" sub="CCTV cameras, laptops and accessories — new and second-hand. Add items to your list and generate a quotation instantly." />
      <section className="bg-slate-50/60 py-12 md:py-16">
        <div className="container">
          <CategoryTabs counts={counts} />
          <ProductBrowser products={all} showCategory />
        </div>
      </section>
    </>
  );
}
