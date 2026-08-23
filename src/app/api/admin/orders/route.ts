import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  listOrders,
  updateOrderStatus,
  getOrderById,
} from "@/lib/orders-store";
import { releaseLines } from "@/lib/stock";
import { sendBuyerOrderEmail } from "@/lib/email";
import type { OrderStatus } from "@/types/product";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { orderId?: string; status?: OrderStatus };
  if (!body.orderId || !body.status) {
    return NextResponse.json(
      { error: "orderId and status required" },
      { status: 400 }
    );
  }

  const order = await getOrderById(body.orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (body.status === "cancelled" && order.status !== "cancelled") {
    await releaseLines(
      order.items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      }))
    );
  }

  const updated = await updateOrderStatus(body.orderId, body.status);
  if (
    updated &&
    (body.status === "shipped" ||
      body.status === "delivered" ||
      body.status === "cancelled")
  ) {
    await sendBuyerOrderEmail(updated);
  }

  return NextResponse.json({ order: updated });
}
