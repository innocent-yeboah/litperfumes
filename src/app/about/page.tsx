import { siteConfig } from "@/lib/site";

export default function AboutPage() {
  return (
    <div className="container-lp max-w-3xl py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
        Our story
      </p>
      <h1 className="section-heading mt-2">About Lit Perfumes</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-brand-navy/80">
        <p>
          Lit Perfumes curates authentic luxury fragrances for discerning clients across Ghana and
          West Africa. We believe a signature scent should feel as considered as the life it
          accompanies.
        </p>
        <p>
          Based in {siteConfig.location}, we hold stock in-house so you receive the real bottle —
          carefully packed, honestly described, and backed by our authenticity guarantee.
        </p>
      </div>
    </div>
  );
}
