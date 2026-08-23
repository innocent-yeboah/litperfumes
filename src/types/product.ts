export type ProductVariant = {
  id: string;
  sizeMl: number;
  priceGhs: number;
  sku: string;
  onHand: number;
  reserved: number;
};

export type Product = {
  id: string;
  brand: string;
  name: string;
  slug: string;
  description: string;
  concentration: string;
  notesTop: string[];
  notesMid: string[];
  notesBase: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  gender: "Women" | "Men" | "Unisex";
  variants: ProductVariant[];
};

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  brand: string;
  name: string;
  sizeMl: number;
  priceGhs: number;
  image: string;
  quantity: number;
};

export type OrderStatus =
  | "awaiting_payment"
  | "paid"
  | "cod_confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export type PaymentMethod = "paystack" | "cod";

export function availableStock(variant: Pick<ProductVariant, "onHand" | "reserved">): number {
  return Math.max(0, variant.onHand - variant.reserved);
}
