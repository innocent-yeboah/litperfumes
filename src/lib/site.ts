export const siteConfig = {
  name: "Lit Perfumes",
  tagline: "Authentic luxury scents, curated for you",
  description:
    "Lit Perfumes is an authorized reseller of authentic designer and niche fragrances — delivered across Ghana and West Africa.",
  email: "hello@litperfumes.com",
  phone: "+233 54 035 7260",
  location: "Kumasi, Ghana",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ??
    process.env.WHATSAPP_BUSINESS_NUMBER ??
    "233540357260",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
  /** Flat shipping in GHS */
  shippingGhs: 75,
  /** Free shipping threshold in GHS */
  freeShippingOverGhs: 1500,
  /** COD maximum order total in GHS */
  codMaxGhs: Number(process.env.COD_MAX_GHS ?? 2000),
  /** Paystack awaiting_payment reservation expiry (minutes) */
  paystackReserveMinutes: 45,
  /** Processing page poll timeout (ms) */
  paymentPollTimeoutMs: 120000,
  currency: "GHS" as const,
  authenticityBadge: "100% Authentic",
};

export function formatGhs(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
export function shippingForSubtotal(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= siteConfig.freeShippingOverGhs) return 0;
  return siteConfig.shippingGhs;
}
