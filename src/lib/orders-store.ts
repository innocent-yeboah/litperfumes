import type { CartItem, OrderStatus, PaymentMethod } from "@/types/product";
import {
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export type StoredOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: "GHS";
  customerName: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
  };
  giftNote?: string;
  paymentMethod: PaymentMethod;
  paystackReference?: string;
  codFlag: boolean;
  items: Array<{
    productId: string;
    variantId: string;
    brand: string;
    name: string;
    sizeMl: number;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  expiresAt?: string;
};

type DbOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  currency: string;
  customer_name: string;
  email: string;
  phone: string;
  address: StoredOrder["address"];
  gift_note: string | null;
  payment_method: PaymentMethod;
  paystack_reference: string | null;
  cod_flag: boolean;
  subtotal: number | string;
  shipping_fee: number | string;
  total: number | string;
  created_at: string;
  expires_at: string | null;
  order_items?: DbOrderItem[];
};

type DbOrderItem = {
  product_id: string | null;
  variant_id: string | null;
  brand: string;
  product_name: string;
  size_ml: number;
  quantity: number;
  unit_price: number | string;
};

const globalStore = globalThis as unknown as {
  __litOrders?: Map<string, StoredOrder>;
  __litReservations?: Map<string, number>;
};

function ordersMap() {
  if (!globalStore.__litOrders) globalStore.__litOrders = new Map();
  return globalStore.__litOrders;
}

function reservationsMap() {
  if (!globalStore.__litReservations) globalStore.__litReservations = new Map();
  return globalStore.__litReservations;
}

export function generateOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `LP-${n}`;
}

export function cartToOrderItems(items: CartItem[]) {
  return items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    brand: item.brand,
    name: item.name,
    sizeMl: item.sizeMl,
    quantity: item.quantity,
    unitPrice: item.priceGhs,
  }));
}

function mapDbOrder(row: DbOrder): StoredOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    currency: "GHS",
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    giftNote: row.gift_note ?? undefined,
    paymentMethod: row.payment_method,
    paystackReference: row.paystack_reference ?? undefined,
    codFlag: row.cod_flag,
    items: (row.order_items ?? []).map((i) => ({
      productId: i.product_id ?? "",
      variantId: i.variant_id ?? "",
      brand: i.brand,
      name: i.product_name,
      sizeMl: i.size_ml,
      quantity: i.quantity,
      unitPrice: Number(i.unit_price),
    })),
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee),
    total: Number(row.total),
    createdAt: row.created_at,
    expiresAt: row.expires_at ?? undefined,
  };
}

function memorySave(order: StoredOrder) {
  ordersMap().set(order.id, order);
  if (order.orderNumber) ordersMap().set(order.orderNumber, order);
}

function memoryGetById(id: string) {
  return ordersMap().get(id);
}

function memoryList(): StoredOrder[] {
  const seen = new Set<string>();
  const list: StoredOrder[] = [];
  for (const order of ordersMap().values()) {
    if (seen.has(order.id)) continue;
    seen.add(order.id);
    list.push(order);
  }
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  if (!isSupabaseConfigured()) {
    memorySave(order);
    return order;
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("orders").upsert({
    id: order.id,
    order_number: order.orderNumber,
    status: order.status,
    currency: order.currency,
    customer_name: order.customerName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    gift_note: order.giftNote ?? null,
    payment_method: order.paymentMethod,
    paystack_reference: order.paystackReference ?? null,
    cod_flag: order.codFlag,
    subtotal: order.subtotal,
    shipping_fee: order.shippingFee,
    total: order.total,
    created_at: order.createdAt,
    expires_at: order.expiresAt ?? null,
  });
  if (error) throw new Error(error.message);

  // Replace items
  await supabase.from("order_items").delete().eq("order_id", order.id);
  if (order.items.length) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      order.items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        variant_id: isUuid(i.variantId) ? i.variantId : null,
        brand: i.brand,
        product_name: i.name,
        size_ml: i.sizeMl,
        quantity: i.quantity,
        unit_price: i.unitPrice,
      }))
    );
    if (itemsError) throw new Error(itemsError.message);
  }

  memorySave(order); // keep warm cache for same process
  return order;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function getOrderById(
  id: string
): Promise<StoredOrder | undefined> {
  if (!isSupabaseConfigured()) {
    return memoryGetById(id);
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[orders] getOrderById", error.message);
    return memoryGetById(id);
  }
  if (!data) return memoryGetById(id);
  const order = mapDbOrder(data as DbOrder);
  memorySave(order);
  return order;
}

export async function getOrderByReference(
  ref: string
): Promise<StoredOrder | undefined> {
  if (!isSupabaseConfigured()) {
    for (const order of ordersMap().values()) {
      if (order.paystackReference === ref || order.orderNumber === ref) {
        return order;
      }
    }
    return undefined;
  }
  const supabase = createServiceClient();
  const byRef = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("paystack_reference", ref)
    .maybeSingle();
  if (byRef.data) {
    const order = mapDbOrder(byRef.data as DbOrder);
    memorySave(order);
    return order;
  }
  const byNumber = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", ref)
    .maybeSingle();
  if (byNumber.data) {
    const order = mapDbOrder(byNumber.data as DbOrder);
    memorySave(order);
    return order;
  }
  return undefined;
}

export async function listOrders(): Promise<StoredOrder[]> {
  if (!isSupabaseConfigured()) {
    return memoryList();
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[orders] listOrders", error.message);
    return memoryList();
  }
  return (data as DbOrder[]).map(mapDbOrder);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: Partial<StoredOrder>
): Promise<StoredOrder | undefined> {
  const existing = await getOrderById(id);
  if (!existing) return undefined;
  const updated: StoredOrder = { ...existing, ...extra, status };

  if (!isSupabaseConfigured()) {
    memorySave(updated);
    return updated;
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("orders")
    .update({
      status: updated.status,
      paystack_reference: updated.paystackReference ?? null,
      gift_note: updated.giftNote ?? null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  // On paid: convert reservation → sale
  if (status === "paid" && existing.status !== "paid") {
    for (const item of updated.items) {
      if (!isUuid(item.variantId)) continue;
      await supabase.rpc("confirm_stock_sale", {
        p_variant_id: item.variantId,
        p_qty: item.quantity,
      });
    }
  }

  memorySave(updated);
  return updated;
}

/** In-memory reservation helpers (used when Supabase is off). */
export function reserveVariant(variantId: string, qty: number): boolean {
  const map = reservationsMap();
  map.set(variantId, (map.get(variantId) ?? 0) + qty);
  return true;
}

export function releaseVariant(variantId: string, qty: number) {
  const map = reservationsMap();
  map.set(variantId, Math.max(0, (map.get(variantId) ?? 0) - qty));
}

export function getReserved(variantId: string): number {
  return reservationsMap().get(variantId) ?? 0;
}
