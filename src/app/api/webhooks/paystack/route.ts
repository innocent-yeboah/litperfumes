import { NextResponse } from "next/server";
import {
  getOrderByReference,
  updateOrderStatus,
} from "@/lib/orders-store";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";
import { sendBuyerOrderEmail, sendTeamOrderEmail } from "@/lib/email";
import { releaseLines } from "@/lib/stock";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (process.env.PAYSTACK_SECRET_KEY) {
    if (!verifyPaystackWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: {
    event?: string;
    data?: { reference?: string; status?: string; amount?: number };
  };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    const order = await getOrderByReference(event.data.reference);
    if (!order) {
      return NextResponse.json({ received: true, matched: false });
    }
    if (order.status === "paid") {
      return NextResponse.json({ received: true, alreadyPaid: true });
    }

    // Amount check (pesewas / kobo)
    if (typeof event.data.amount === "number") {
      const expected = Math.round(order.total * 100);
      if (event.data.amount !== expected) {
        console.error(
          "[paystack webhook] amount mismatch",
          event.data.amount,
          expected,
          order.orderNumber
        );
        return NextResponse.json(
          { error: "Amount mismatch", received: true },
          { status: 400 }
        );
      }
    }

    if (order.status === "awaiting_payment") {
      const paid = await updateOrderStatus(order.id, "paid");
      if (paid) {
        await sendBuyerOrderEmail(paid);
        await sendTeamOrderEmail(paid);
      }
    }
  }

  if (event.event === "charge.failed" && event.data?.reference) {
    const order = await getOrderByReference(event.data.reference);
    if (order && order.status === "awaiting_payment") {
      await releaseLines(
        order.items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        }))
      );
      await updateOrderStatus(order.id, "failed");
    }
  }

  return NextResponse.json({ received: true });
}
