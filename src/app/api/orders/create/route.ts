import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { checkoutSchema, assertCodAllowed } from "@/lib/validations";
import { shippingForSubtotal, siteConfig } from "@/lib/site";
import {
  cartToOrderItems,
  generateOrderNumber,
  saveOrder,
  type StoredOrder,
} from "@/lib/orders-store";
import { tryReserveLines } from "@/lib/stock";
import {
  demoCheckoutEnabled,
  initializePaystackTransaction,
  paystackConfigured,
} from "@/lib/paystack";
import { sendBuyerOrderEmail, sendTeamOrderEmail } from "@/lib/email";
import { getVariant } from "@/lib/catalog";

const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  slug: z.string(),
  brand: z.string(),
  name: z.string(),
  sizeMl: z.number(),
  priceGhs: z.number(),
  image: z.string(),
  quantity: z.number().int().positive(),
});

const bodySchema = z.object({
  customer: checkoutSchema,
  items: z.array(cartItemSchema).min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { customer, items } = parsed.data;

    const priced = [];
    for (const item of items) {
      const found = await getVariant(item.productId, item.variantId);
      if (!found) {
        return NextResponse.json(
          { error: `Unknown product variant: ${item.variantId}` },
          { status: 400 }
        );
      }
      priced.push({
        ...item,
        priceGhs: found.variant.priceGhs,
        brand: found.product.brand,
        name: found.product.name,
        sizeMl: found.variant.sizeMl,
      });
    }

    const subtotal = priced.reduce(
      (sum, item) => sum + item.priceGhs * item.quantity,
      0
    );
    const shippingFee = shippingForSubtotal(subtotal);
    const total = subtotal + shippingFee;

    const codError = assertCodAllowed(total, customer.paymentMethod);
    if (codError) {
      return NextResponse.json({ error: codError }, { status: 400 });
    }

    const reserve = await tryReserveLines(
      priced.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      }))
    );
    if (!reserve.ok) {
      return NextResponse.json({ error: reserve.error }, { status: 409 });
    }

    const id = randomUUID();
    const orderNumber = generateOrderNumber();
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + siteConfig.paystackReserveMinutes * 60 * 1000
    );

    const isCod = customer.paymentMethod === "cod";
    const paystackReference = isCod
      ? undefined
      : `ps_${orderNumber.replace("-", "")}_${Date.now()}`;

    const order: StoredOrder = {
      id,
      orderNumber,
      status: isCod ? "cod_confirmed" : "awaiting_payment",
      currency: "GHS",
      customerName: customer.customerName,
      email: customer.email,
      phone: customer.phone,
      address: {
        line1: customer.addressLine1,
        line2: customer.addressLine2,
        city: customer.city,
        state: customer.state,
        country: customer.country,
      },
      giftNote: customer.giftNote,
      paymentMethod: customer.paymentMethod,
      paystackReference,
      codFlag: isCod,
      items: cartToOrderItems(priced),
      subtotal,
      shippingFee,
      total,
      createdAt: now.toISOString(),
      expiresAt: isCod ? undefined : expiresAt.toISOString(),
    };

    await saveOrder(order);

    if (isCod) {
      await sendBuyerOrderEmail(order);
      await sendTeamOrderEmail(order);
      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        message: "Order placed — pay on delivery.",
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const callbackUrl = `${siteUrl}/order-confirmation?orderId=${order.id}`;

    if (paystackConfigured() && !demoCheckoutEnabled()) {
      const init = await initializePaystackTransaction({
        email: order.email,
        amountKobo: Math.round(order.total * 100),
        reference: paystackReference!,
        callbackUrl,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });
      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        authorizationUrl: init.authorizationUrl,
        reference: init.reference,
      });
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      demo: true,
      authorizationUrl: `${siteUrl}/order-confirmation?orderId=${order.id}&demo=1`,
      reference: paystackReference,
      message:
        "Demo checkout — Paystack keys not configured. Completing payment in demo mode.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create order" },
      { status: 500 }
    );
  }
}
