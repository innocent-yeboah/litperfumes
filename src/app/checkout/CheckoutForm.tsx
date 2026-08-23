"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  checkoutSchema,
  type CheckoutFormValues,
  assertCodAllowed,
} from "@/lib/validations";
import { useCartStore } from "@/store/cart";
import { formatGhs, siteConfig } from "@/lib/site";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shipping = useCartStore((s) => s.getShipping());
  const total = useCartStore((s) => s.getTotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "Ghana",
      paymentMethod: "paystack",
      giftNote: "",
    },
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="py-20 text-center text-brand-navy/60">Loading checkout…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="section-heading">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary mt-8">
          Shop fragrances
        </Link>
      </div>
    );
  }

  async function goToStep2() {
    const ok = await trigger([
      "customerName",
      "email",
      "emailConfirm",
      "phone",
      "addressLine1",
      "city",
      "state",
      "country",
      "giftNote",
    ]);
    if (ok) setStep(2);
  }

  async function onSubmit(values: CheckoutFormValues) {
    setError("");
    const codErr = assertCodAllowed(total, values.paymentMethod);
    if (codErr) {
      setError(codErr);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: values, items }),
      });
      const data = (await res.json()) as {
        error?: string | object;
        orderId?: string;
        orderNumber?: string;
        status?: string;
        authorizationUrl?: string;
        demo?: boolean;
      };

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not place order. Please try again."
        );
        setSubmitting(false);
        return;
      }

      if (values.paymentMethod === "cod") {
        clearCart();
        router.push(
          `/order-confirmation?orderId=${data.orderId}&status=cod_confirmed`
        );
        return;
      }

      if (data.authorizationUrl) {
        // Do not clear cart until paid (Rule 3) — confirmation page clears on paid
        window.location.href = data.authorizationUrl;
        return;
      }

      setError("Payment could not be started.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const codBlocked = total > siteConfig.codMaxGhs;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4 text-sm">
          <span className={step === 1 ? "font-semibold text-brand-gold" : "text-brand-navy/50"}>
            1. Delivery
          </span>
          <span className="text-brand-navy/30">/</span>
          <span className={step === 2 ? "font-semibold text-brand-gold" : "text-brand-navy/50"}>
            2. Payment
          </span>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <h1 className="section-heading">Delivery details</h1>
            <p className="text-sm text-brand-navy/60">
              Guest checkout — no account needed. Order updates use this email and your order number.
            </p>

            <div>
              <label className="label-field" htmlFor="customerName">
                Full name
              </label>
              <input id="customerName" className="input-field" {...register("customerName")} />
              {errors.customerName ? (
                <p className="mt-1 text-xs text-red-600">{errors.customerName.message}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field" htmlFor="email">
                  Email
                </label>
                <input id="email" type="email" className="input-field" {...register("email")} />
                {errors.email ? (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                ) : null}
              </div>
              <div>
                <label className="label-field" htmlFor="emailConfirm">
                  Confirm email
                </label>
                <input
                  id="emailConfirm"
                  type="email"
                  className="input-field"
                  {...register("emailConfirm")}
                />
                {errors.emailConfirm ? (
                  <p className="mt-1 text-xs text-red-600">{errors.emailConfirm.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="phone">
                Phone (WhatsApp preferred)
              </label>
              <input id="phone" className="input-field" {...register("phone")} />
              {errors.phone ? (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              ) : null}
            </div>

            <div>
              <label className="label-field" htmlFor="addressLine1">
                Street address
              </label>
              <input id="addressLine1" className="input-field" {...register("addressLine1")} />
              {errors.addressLine1 ? (
                <p className="mt-1 text-xs text-red-600">{errors.addressLine1.message}</p>
              ) : null}
            </div>

            <div>
              <label className="label-field" htmlFor="addressLine2">
                Apartment / landmark (optional)
              </label>
              <input id="addressLine2" className="input-field" {...register("addressLine2")} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label-field" htmlFor="city">
                  City
                </label>
                <input id="city" className="input-field" {...register("city")} />
                {errors.city ? (
                  <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                ) : null}
              </div>
              <div>
                <label className="label-field" htmlFor="state">
                  State / region
                </label>
                <input id="state" className="input-field" {...register("state")} />
                {errors.state ? (
                  <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>
                ) : null}
              </div>
              <div>
                <label className="label-field" htmlFor="country">
                  Country
                </label>
                <input id="country" className="input-field" {...register("country")} />
                {errors.country ? (
                  <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="giftNote">
                Gift note (optional)
              </label>
              <textarea
                id="giftNote"
                rows={3}
                className="input-field"
                placeholder="A short message for the recipient"
                {...register("giftNote")}
              />
            </div>

            <p className="text-xs text-brand-navy/50">
              All prices and payments are in Ghanaian Cedis (GHS).
            </p>

            <button type="button" className="btn-primary" onClick={goToStep2}>
              Continue to payment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="section-heading">Payment</h1>
            <p className="badge-authentic">{siteConfig.authenticityBadge}</p>

            <fieldset className="space-y-3">
              <legend className="label-field">Payment method</legend>
              <label className="flex cursor-pointer items-start gap-3 border border-brand-navy/15 p-4">
                <input type="radio" value="paystack" {...register("paymentMethod")} />
                <span>
                  <span className="block font-medium text-brand-navy">
                    Pay online (card / bank / USSD)
                  </span>
                  <span className="text-sm text-brand-navy/60">
                    Secure payment via Paystack. Confirmation only after payment is verified.
                  </span>
                </span>
              </label>
              <label
                className={`flex items-start gap-3 border border-brand-navy/15 p-4 ${
                  codBlocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
              >
                <input
                  type="radio"
                  value="cod"
                  disabled={codBlocked}
                  {...register("paymentMethod")}
                />
                <span>
                  <span className="block font-medium text-brand-navy">Cash on delivery</span>
                  <span className="text-sm text-brand-navy/60">
                    Available up to {formatGhs(siteConfig.codMaxGhs)}. You will pay when your order arrives.
                  </span>
                </span>
              </label>
            </fieldset>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep(1)}
                disabled={submitting}
              >
                Back
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting
                  ? "Placing order…"
                  : paymentMethod === "cod"
                    ? "Place COD order"
                    : "Pay with Paystack"}
              </button>
            </div>
          </div>
        )}
      </form>

      <aside className="h-fit border border-brand-navy/10 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl text-brand-navy">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between gap-3">
              <span className="text-brand-navy/80">
                {item.name} ({item.sizeMl}ml) × {item.quantity}
              </span>
              <span>{formatGhs(item.priceGhs * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-brand-navy/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-brand-navy/60">Subtotal</dt>
            <dd>{formatGhs(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-brand-navy/60">Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatGhs(shipping)}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>Total</dt>
            <dd>{formatGhs(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
