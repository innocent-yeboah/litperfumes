import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-navy/10 bg-brand-navy text-brand-white">
      <div className="container-lp grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">
            Lit <span className="text-brand-gold">Perfumes</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {siteConfig.tagline}. Authorized reseller of authentic designer and niche fragrances.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/shop" className="hover:text-brand-gold">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/authenticity" className="hover:text-brand-gold">
                Authenticity Guarantee
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-brand-gold">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-gold">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Policies
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/privacy" className="hover:text-brand-gold">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-gold">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Concierge
          </p>
          <p className="mt-4 text-sm text-white/80">{siteConfig.email}</p>
          <p className="mt-1 text-sm text-white/80">{siteConfig.location}</p>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            Prices in GHS. We deliver across Ghana and West Africa.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
