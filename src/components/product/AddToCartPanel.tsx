"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { formatGhs, siteConfig } from "@/lib/site";
import { availableStock, type Product } from "@/types/product";
import { useCartStore } from "@/store/cart";

export function AddToCartPanel({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const available = variant ? availableStock(variant) : 0;
  const lineTotal = (variant?.priceGhs ?? 0) * qty;

  function handleAdd(goToCart?: boolean) {
    if (!variant || available < 1) {
      setMessage("This size is currently unavailable.");
      return;
    }
    if (qty > available) {
      setMessage(`Only ${available} available.`);
      return;
    }
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      brand: product.brand,
      name: product.name,
      sizeMl: variant.sizeMl,
      priceGhs: variant.priceGhs,
      image: product.images[0],
      quantity: qty,
    });
    setMessage("Added to cart.");
    if (goToCart) router.push("/cart");
  }

  const addLabel =
    available === 0
      ? "Sold out"
      : `Add to cart — ${formatGhs(lineTotal)}`;

  return (
    <>
      <div className="space-y-6">
        <p className="badge-authentic">{siteConfig.authenticityBadge}</p>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl text-brand-navy sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-brand-navy/60">{product.concentration}</p>
        </div>

        <p className="font-display text-3xl text-brand-navy sm:text-4xl">
          {formatGhs(variant?.priceGhs ?? 0)}
        </p>

        <div className="rounded-sm border-2 border-brand-gold/35 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Add to your order
          </p>

          <div className="mt-4">
            <label className="label-field" htmlFor="size">
              Size
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const avail = availableStock(v);
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={avail === 0}
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-sm border px-4 py-2 text-sm transition ${
                      variantId === v.id
                        ? "border-brand-gold bg-brand-gold/15 font-semibold text-brand-navy"
                        : "border-brand-navy/20 text-brand-navy"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {v.sizeMl}ml — {formatGhs(v.priceGhs)}
                  </button>
                );
              })}
            </div>
            {available > 0 && available <= 5 ? (
              <p className="mt-2 text-sm font-medium text-brand-rose">
                Only {available} left
              </p>
            ) : null}
            {available === 0 ? (
              <p className="mt-2 text-sm font-medium text-red-600">Sold out</p>
            ) : null}
          </div>

          <div className="mt-4">
            <label className="label-field" htmlFor="qty">
              Quantity
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              max={Math.max(1, available)}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
              className="input-field max-w-[120px]"
            />
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              className="btn-primary w-full py-4 text-base shadow-md"
              disabled={available === 0}
              onClick={() => handleAdd(false)}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden />
              {addLabel}
            </button>
            <button
              type="button"
              className="btn-secondary w-full py-3"
              disabled={available === 0}
              onClick={() => handleAdd(true)}
            >
              Buy now
            </button>
          </div>

          {message ? (
            <p
              className={`mt-3 text-center text-sm font-medium ${
                message === "Added to cart."
                  ? "text-emerald-700"
                  : "text-brand-navy/70"
              }`}
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>

      {available > 0 ? (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-navy/10 bg-brand-white/95 p-3 shadow-[0_-4px_24px_rgba(26,26,46,0.12)] backdrop-blur-sm lg:hidden"
          aria-label="Quick add to cart"
        >
          <div className="flex items-center gap-3 pr-16">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-brand-navy/60">
                {product.name}
              </p>
              <p className="font-display text-lg text-brand-navy">
                {formatGhs(lineTotal)}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary shrink-0 px-5 py-3.5 text-sm shadow-md"
              onClick={() => handleAdd(false)}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              Add to cart
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
