"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useCartStore } from "@/store/cart";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/authenticity", label: "Authenticity" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        scrolled
          ? "border-brand-navy/10 bg-brand-white/95 shadow-sm backdrop-blur"
          : "border-transparent bg-brand-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container-lp flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="font-display text-xl text-brand-navy sm:text-2xl">
          Lit <span className="text-brand-gold">Perfumes</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-brand-navy/80 transition hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-sm p-2 text-brand-navy transition hover:text-brand-gold"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-navy">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="rounded-sm p-2 text-brand-navy md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-brand-navy/10 bg-brand-white px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-sm font-medium text-brand-navy"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-brand-gold">
            {siteConfig.authenticityBadge}
          </p>
        </nav>
      ) : null}
    </header>
  );
}
