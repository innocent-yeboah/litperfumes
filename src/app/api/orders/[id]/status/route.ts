import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/orders-store";
import { releaseLines } from "@/lib/stock";
import { siteConfig } from "@/lib/site";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const order = await getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (
    order.status === "awaiting_payment" &&
    order.expiresAt &&
    new Date(order.expiresAt).getTime() < Date.now()
  ) {
    await releaseLines(
      order.items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      }))
    );
    const expired = await updateOrderStatus(order.id, "cancelled");
    return NextResponse.json({
      id: expired?.id,
      orderNumber: expired?.orderNumber,
      status: "cancelled",
      message: "Payment window expired. Stock released.",
    });
  }

  return NextResponse.json({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    paymentMethod: order.paymentMethod,
    pollTimeoutMs: siteConfig.paymentPollTimeoutMs,
  });
}
