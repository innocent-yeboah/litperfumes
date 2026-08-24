"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { formatGhs } from "@/lib/site";
import { availableStock, type Product } from "@/types/product";

export function ShopClient({
  products,
  brands,
}: {
  products: Product[];
  brands: string[];
}) {
  const [brand, setBrand] = useState<string>("all");
  const [gender, setGender] = useState<string>("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p.active) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (gender !== "all" && p.gender !== gender) return false;
      return true;
    });
  }, [products, brand, gender]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        <select
          className="input-field max-w-xs"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          aria-label="Filter by brand"
        >
          <option value="all">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          className="input-field max-w-xs"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          aria-label="Filter by gender"
        >
          <option value="all">All</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Unisex">Unisex</option>
        </select>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
        {filtered.map((product) => {
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
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold sm:mt-4 sm:text-[11px] sm:tracking-[0.18em]">
                {product.brand}
              </p>
              <h2 className="mt-0.5 font-display text-base text-brand-navy sm:mt-1 sm:text-2xl">
                {product.name}
              </h2>
              <p className="mt-0.5 text-xs text-brand-navy/70 sm:mt-1 sm:text-sm">
                {formatGhs(variant?.priceGhs ?? 0)}
                {available === 0 ? (
                  <span className="ml-2 text-red-600">Sold out</span>
                ) : available <= 5 ? (
                  <span className="ml-2 text-brand-rose">Only {available} left</span>
                ) : null}
              </p>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-brand-navy/60">
          No fragrances match these filters.
        </p>
      ) : null}
    </>
  );
}
