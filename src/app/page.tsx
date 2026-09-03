import Link from "next/link";
import Image from "next/image";
import { siteConfig, formatGhs } from "@/lib/site";
import { getFeaturedProducts } from "@/lib/catalog";
import { availableStock } from "@/types/product";

export default async function HomePage() {
  const featured = (await getFeaturedProducts()).slice(0, 4);

  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 animate-hero-ken">
          <Image
            src="/hero-oud-wood-gift.png"
            alt="Tom Ford Oud Wood presented as a luxury gift — black box, gold ribbon, amber bottle"
            fill
            priority
            className="object-cover object-[62%_40%] sm:object-[70%_42%]"
            sizes="100vw"
            quality={90}
          />
        </div>
        <div className="absolute inset-0 bg-hero-wash" />
        <div className="absolute inset-0 bg-hero-vignette" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-navy/80 to-transparent"
          aria-hidden
        />

        <div className="container-lp relative flex min-h-[92vh] flex-col justify-end pb-16 pt-28 sm:pb-24">
          <div className="max-w-xl">
            <h1 className="animate-fade-up font-display text-[2.75rem] leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Lit{" "}
              <span className="text-brand-gold">Perfumes</span>
            </h1>
            <div
              className="mt-5 h-px w-24 origin-left bg-brand-gold animate-gold-line"
              aria-hidden
            />
            <p className="mt-6 max-w-md animate-fade-up text-base leading-relaxed text-white/88 sm:text-lg [animation-delay:160ms]">
              Oud Wood, gift-ready. The scent you&apos;ve been searching for —
              authentically sourced, beautifully presented.
            </p>
            <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:280ms]">
              <Link
                href="/product/tom-ford-oud-wood"
                className="btn-primary px-8 py-3.5 text-base shadow-[0_8px_30px_rgba(201,169,98,0.35)]"
              >
                Discover Oud Wood
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/45 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-brand-gold hover:bg-white/10"
              >
                Shop the collection
              </Link>
            </div>
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
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
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
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold sm:mt-4 sm:text-[11px] sm:tracking-[0.18em]">
                  {product.brand}
                </p>
                <h3 className="mt-0.5 font-display text-base text-brand-navy sm:mt-1 sm:text-xl">
                  {product.name}
                </h3>
                <p className="mt-0.5 text-xs text-brand-navy/70 sm:mt-1 sm:text-sm">
                  {formatGhs(variant?.priceGhs ?? 0)}
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
