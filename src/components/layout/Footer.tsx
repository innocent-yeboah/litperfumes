import Link from "next/link";
import { siteConfig } from "@/lib/site";

const exploreLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/authenticity", label: "Authenticity" },
  { href: "/returns", label: "Returns" },
  { href: "/about", label: "About" },
] as const;

const policyLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const wa = `https://wa.me/${siteConfig.whatsapp}`;

  return (
    <footer className="mt-12 border-t border-brand-navy/10 bg-brand-navy text-brand-white sm:mt-20">
      <div className="container-lp py-8 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-4 lg:gap-10">
          <div className="lg:col-span-1">
            <p className="font-display text-xl sm:text-2xl">
              Lit <span className="text-brand-gold">Perfumes</span>
            </p>
            <p className="mt-2 text-sm text-white/70">{siteConfig.tagline}.</p>
            <p className="mt-2 hidden text-sm leading-relaxed text-white/60 sm:block">
              Authorized reseller of authentic designer and niche fragrances.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 lg:col-span-2 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold sm:text-xs sm:tracking-[0.2em]">
                Explore
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-white/80 sm:mt-4 sm:space-y-2">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-brand-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold sm:text-xs sm:tracking-[0.2em]">
                Policies
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-white/80 sm:mt-4 sm:space-y-2">
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-brand-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 lg:border-0 lg:pt-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold sm:text-xs sm:tracking-[0.2em]">
              Concierge
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80 sm:mt-4 sm:flex-col sm:gap-y-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-brand-gold"
              >
                {siteConfig.email}
              </a>
              <a href="tel:+233540357260" className="hover:text-brand-gold">
                {siteConfig.phone}
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold"
              >
                WhatsApp
              </a>
            </div>
            <p className="mt-3 text-xs text-white/50">
              {siteConfig.location} · GHS · Ghana &amp; West Africa
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] text-white/50 sm:py-5 sm:text-xs">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
