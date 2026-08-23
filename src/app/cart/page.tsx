"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatGhs, siteConfig } from "@/lib/site";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shipping = useCartStore((s) => s.getShipping());
  const total = useCartStore((s) => s.getTotal());

  if (items.length === 0) {
    return (
      <div className="container-lp py-20 text-center">
        <h1 className="section-heading">Your cart is empty</h1>
        <p className="mt-3 text-brand-navy/70">Discover a scent that feels like you.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Browse fragrances
        </Link>
      </div>
    );
  }

  return (
    <div className="container-lp py-12 sm:py-16">
      <h1 className="section-heading">Cart</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-6">
          {items.map((item) => (
            <li
              key={item.variantId}
              className="flex gap-4 border-b border-brand-navy/10 pb-6"
            >
              <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-brand-mist">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-[11px] uppercase tracking-[0.16em] text-brand-gold">
                  {item.brand}
                </p>
                <Link
                  href={`/product/${item.slug}`}
                  className="font-display text-lg text-brand-navy hover:text-brand-gold"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-brand-navy/60">{item.sizeMl}ml</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.variantId, Number(e.target.value) || 1)
                    }
                    className="input-field w-20 py-2"
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <p className="font-medium text-brand-navy">
                    {formatGhs(item.priceGhs * item.quantity)}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 self-start text-xs text-brand-navy/50 underline hover:text-brand-navy"
                  onClick={() => removeItem(item.variantId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-brand-navy/10 bg-white p-6">
          <h2 className="font-display text-xl text-brand-navy">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-navy/60">Subtotal</dt>
              <dd>{formatGhs(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-navy/60">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatGhs(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-brand-navy/10 pt-3 font-semibold">
              <dt>Total</dt>
              <dd>{formatGhs(total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-brand-navy/50">
            Free shipping over {formatGhs(siteConfig.freeShippingOverGhs)}. Prices in GHS.
          </p>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
