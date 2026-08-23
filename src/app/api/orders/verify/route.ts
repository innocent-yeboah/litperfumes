import { NextResponse } from "next/server";
import {
  getOrderById,
  getOrderByReference,
  updateOrderStatus,
} from "@/lib/orders-store";
import {
  demoCheckoutEnabled,
  verifyPaystackTransaction,
} from "@/lib/paystack";
import { sendBuyerOrderEmail, sendTeamOrderEmail } from "@/lib/email";

/**
 * Marks an awaiting_payment order as paid after Paystack verify (or demo complete).
 * Idempotent.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      orderId?: string;
      reference?: string;
      demoComplete?: boolean;
    };

    let order = body.orderId ? await getOrderById(body.orderId) : undefined;
    if (!order && body.reference) {
      order = await getOrderByReference(body.reference);
    }
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: "paid",
        alreadyPaid: true,
      });
    }

    if (order.status !== "awaiting_payment") {
      return NextResponse.json(
        { error: `Cannot verify order in status ${order.status}` },
        { status: 400 }
      );
    }

    // Demo only when Paystack is not live-configured
    if (body.demoComplete && demoCheckoutEnabled()) {
      const paid = await updateOrderStatus(order.id, "paid");
      if (paid) {
        await sendBuyerOrderEmail(paid);
        await sendTeamOrderEmail(paid);
      }
      return NextResponse.json({
        orderId: paid?.id,
        orderNumber: paid?.orderNumber,
        status: "paid",
        demo: true,
      });
    }

    const reference = body.reference ?? order.paystackReference;
    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference" },
        { status: 400 }
      );
    }

    const result = await verifyPaystackTransaction(reference);
    if (!result.success) {
      return NextResponse.json(
        { error: "Payment not confirmed yet", status: result.status },
        { status: 402 }
      );
    }

    const expectedKobo = Math.round(order.total * 100);
    if (result.amount !== expectedKobo) {
      return NextResponse.json(
        { error: "Paid amount does not match order total" },
        { status: 400 }
      );
    }

    const paid = await updateOrderStatus(order.id, "paid", {
      paystackReference: reference,
    });
    if (paid) {
      await sendBuyerOrderEmail(paid);
      await sendTeamOrderEmail(paid);
    }

    return NextResponse.json({
      orderId: paid?.id,
      orderNumber: paid?.orderNumber,
      status: "paid",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verify failed" },
      { status: 500 }
    );
  }
}
