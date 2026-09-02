import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, listActiveProducts } from "@/lib/catalog";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";

export async function generateStaticParams() {
  const products = await listActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="container-lp pb-28 py-12 sm:py-16 lg:pb-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-mist">
          <Image
            src={product.images[0]}
            alt={`${product.brand} ${product.name}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <AddToCartPanel product={product} />
          <div className="mt-10 border-t border-brand-navy/10 pt-8">
            <h2 className="font-display text-xl text-brand-navy">About this scent</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-navy/75">
              {product.description}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
                  Top
                </p>
                <p className="mt-1 text-sm text-brand-navy/80">
                  {product.notesTop.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
                  Heart
                </p>
                <p className="mt-1 text-sm text-brand-navy/80">
                  {product.notesMid.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">
                  Base
                </p>
                <p className="mt-1 text-sm text-brand-navy/80">
                  {product.notesBase.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
