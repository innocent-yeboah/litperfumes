"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatGhs, siteConfig } from "@/lib/site";

type StatusPayload = {
  id?: string;
  orderNumber?: string;
  status?: string;
  total?: number;
  message?: string;
  error?: string;
};

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const demo = searchParams.get("demo");
  const presetStatus = searchParams.get("status");
  const clearCart = useCartStore((s) => s.clearCart);

  const [payload, setPayload] = useState<StatusPayload | null>(null);
  const [error, setError] = useState("");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("Missing order reference.");
      return;
    }

    let cancelled = false;
    const started = Date.now();

    async function tick() {
      if (cancelled) return;

      // Demo: complete payment once when arriving from demo checkout
      if (demo === "1") {
        await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, demoComplete: true }),
        });
      }

      // While awaiting, try server-side Paystack verify (webhook may be delayed)
      if (!cancelled && orderId) {
        const statusRes = await fetch(`/api/orders/${orderId}/status`);
        const statusData = (await statusRes.json()) as StatusPayload;
        if (statusData.status === "awaiting_payment" && demo !== "1") {
          await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          });
        }
      }

      const res = await fetch(`/api/orders/${orderId}/status`);
      const data = (await res.json()) as StatusPayload;
      if (cancelled) return;
      setPayload(data);

      if (data.status === "paid" || data.status === "cod_confirmed") {
        clearCart();
        return;
      }

      if (data.status === "failed" || data.status === "cancelled") {
        return;
      }

      if (Date.now() - started > siteConfig.paymentPollTimeoutMs) {
        setTimedOut(true);
        return;
      }

      // Keep polling while awaiting_payment
      if (data.status === "awaiting_payment") {
        window.setTimeout(tick, 2000);
      }
    }

    if (presetStatus === "cod_confirmed") {
      fetch(`/api/orders/${orderId}/status`)
        .then((r) => r.json())
        .then((data: StatusPayload) => {
          setPayload(data);
          clearCart();
        })
        .catch(() => setError("Could not load order."));
      return;
    }

    tick();
    return () => {
      cancelled = true;
    };
  }, [orderId, demo, presetStatus, clearCart]);

  if (error) {
    return (
      <div className="py-20 text-center">
        <h1 className="section-heading">We couldn&apos;t find that order</h1>
        <p className="mt-3 text-brand-navy/70">{error}</p>
        <Link href="/shop" className="btn-primary mt-8">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="py-20 text-center">
        <h1 className="section-heading">Payment processing…</h1>
        <p className="mt-3 text-brand-navy/70">
          Confirming your payment. This usually takes a few seconds.
        </p>
      </div>
    );
  }

  if (payload.status === "awaiting_payment" && !timedOut) {
    return (
      <div className="py-20 text-center">
        <h1 className="section-heading">Payment processing…</h1>
        <p className="mt-3 text-brand-navy/70">
          We&apos;re waiting for Paystack to confirm. Please don&apos;t close this page.
        </p>
        <p className="mt-2 text-sm text-brand-navy/50">
          Order {payload.orderNumber}
        </p>
      </div>
    );
  }

  if (timedOut && payload.status === "awaiting_payment") {
    return (
      <div className="py-20 text-center">
        <h1 className="section-heading">Still confirming payment</h1>
        <p className="mt-3 max-w-md mx-auto text-brand-navy/70">
          Your payment may still be processing. Check your email, or retry verification.
          Your order number is <strong>{payload.orderNumber}</strong>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setTimedOut(false);
              window.location.reload();
            }}
          >
            Check again
          </button>
          <a
            className="btn-secondary"
            href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
              `Hello — please help with order ${payload.orderNumber}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp help
          </a>
        </div>
      </div>
    );
  }

  if (payload.status === "failed" || payload.status === "cancelled") {
    return (
      <div className="py-20 text-center">
        <h1 className="section-heading">Payment not completed</h1>
        <p className="mt-3 text-brand-navy/70">
          {payload.message ?? "You can return to checkout and try again."}
        </p>
        <Link href="/checkout" className="btn-primary mt-8">
          Retry checkout
        </Link>
      </div>
    );
  }

  if (payload.status === "cod_confirmed") {
    return (
      <div className="py-20 text-center">
        <p className="badge-authentic justify-center">{siteConfig.authenticityBadge}</p>
        <h1 className="section-heading mt-4">Order placed — pay on delivery</h1>
        <p className="mt-3 text-brand-navy/70">
          Thank you. Please have {payload.total != null ? formatGhs(payload.total) : "the total"}{" "}
          ready when your order arrives.
        </p>
        <p className="mt-6 font-display text-2xl text-brand-navy">
          {payload.orderNumber}
        </p>
        <button
          type="button"
          className="btn-ghost mt-4"
          onClick={() => navigator.clipboard.writeText(payload.orderNumber ?? "")}
        >
          Copy order number
        </button>
        <div className="mt-8">
          <Link href="/shop" className="btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (payload.status === "paid") {
    return (
      <div className="py-20 text-center">
        <p className="badge-authentic justify-center">{siteConfig.authenticityBadge}</p>
        <h1 className="section-heading mt-4">Payment received</h1>
        <p className="mt-3 text-brand-navy/70">
          Thank you. We&apos;ve confirmed your payment
          {payload.total != null ? ` of ${formatGhs(payload.total)}` : ""}. A receipt is on its way
          to your email.
        </p>
        <p className="mt-6 font-display text-2xl text-brand-navy">
          {payload.orderNumber}
        </p>
        <button
          type="button"
          className="btn-ghost mt-4"
          onClick={() => navigator.clipboard.writeText(payload.orderNumber ?? "")}
        >
          Copy order number
        </button>
        <div className="mt-8">
          <Link href="/shop" className="btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 text-center">
      <h1 className="section-heading">Order update</h1>
      <p className="mt-3 text-brand-navy/70">Status: {payload.status}</p>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="container-lp">
      <Suspense
        fallback={
          <p className="py-20 text-center text-brand-navy/60">Loading confirmation…</p>
        }
      >
        <ConfirmationInner />
      </Suspense>
    </div>
  );
}
