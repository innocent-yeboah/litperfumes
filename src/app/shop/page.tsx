import { listActiveProducts, getBrands } from "@/lib/catalog";
import { ShopClient } from "@/components/shop/ShopClient";
import { siteConfig, formatGhs } from "@/lib/site";

export default async function ShopPage() {
  const [products, brands] = await Promise.all([
    listActiveProducts(),
    getBrands(),
  ]);

  return (
    <div className="container-lp py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
        Collection
      </p>
      <h1 className="section-heading mt-2">Shop fragrances</h1>
      <p className="mt-3 max-w-xl text-brand-navy/70">
        Authentic designer and niche scents. Prices in GHS. Free shipping over{" "}
        {formatGhs(siteConfig.freeShippingOverGhs)}.
      </p>
      <ShopClient products={products} brands={brands} />
    </div>
  );
}
