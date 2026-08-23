import Link from "next/link";
import Image from "next/image";
import { siteConfig, formatGhs } from "@/lib/site";
import { getFeaturedProducts } from "@/lib/catalog";
import { availableStock } from "@/types/product";

export default async function HomePage() {
  const featured = (await getFeaturedProducts()).slice(0, 4);

  return (
    <>
      <section className="relative min-h-[85vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600&q=80"
          alt="Luxury perfume bottle on warm surface"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-wash" />
        <div className="container-lp relative flex min-h-[85vh] flex-col justify-end pb-16 pt-28 sm:pb-24">
          <p className="badge-authentic animate-fade-up">
            {siteConfig.authenticityBadge}
          </p>
          <h1 className="mt-4 max-w-2xl animate-fade-up font-display text-4xl text-white sm:text-6xl [animation-delay:80ms]">
            Lit Perfumes
          </h1>
          <p className="mt-4 max-w-lg animate-fade-up text-base text-white/85 sm:text-lg [animation-delay:140ms]">
            {siteConfig.tagline}. Designer and niche fragrances, verified authentic,
            delivered with care.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:200ms]">
            <Link href="/shop" className="btn-primary">
              Shop fragrances
            </Link>
            <Link
              href="/authenticity"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Our guarantee
            </Link>
          </div>
        </div>
      </section>

      <section className="container-lp py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Featured
            </p>
            <h2 className="section-heading mt-2">Signature scents</h2>
          </div>
          <Link href="/shop" className="btn-ghost hidden sm:inline-flex">
            View all
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => {
            const variant = product.variants[0];
            const available = variant ? availableStock(variant) : 0;
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-mist">
                  <Image
                    src={product.images[0]}
                    alt={`${product.brand} ${product.name}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
                  {product.brand}
                </p>
                <h3 className="mt-1 font-display text-xl text-brand-navy">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-brand-navy/70">
                  from {formatGhs(variant?.priceGhs ?? 0)}
                  {available > 0 && available <= 5 ? (
                    <span className="ml-2 text-brand-rose">Only {available} left</span>
                  ) : null}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-brand-navy/10 bg-gold-fade py-16">
        <div className="container-lp max-w-3xl text-center">
          <p className="badge-authentic justify-center">
            {siteConfig.authenticityBadge}
          </p>
          <h2 className="section-heading mt-4">Sourced with integrity</h2>
          <p className="mt-4 text-brand-navy/75">
            Every bottle we sell is authentic. We stand behind our sourcing with a clear
            guarantee — because trust is the foundation of luxury.
          </p>
          <Link href="/authenticity" className="btn-secondary mt-8">
            Read our guarantee
          </Link>
        </div>
      </section>
    </>
  );
}
