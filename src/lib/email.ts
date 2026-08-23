import { Resend } from "resend";
import { formatGhs, siteConfig } from "@/lib/site";
import type { StoredOrder } from "@/lib/orders-store";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendBuyerOrderEmail(order: StoredOrder) {
  const resend = getResend();
  const isPaid = order.status === "paid";
  const isCod = order.status === "cod_confirmed";

  const subject = isCod
    ? `Order ${order.orderNumber} placed — pay on delivery`
    : isPaid
      ? `Payment received — ${order.orderNumber}`
      : `Order ${order.orderNumber} update`;

  const bodyIntro = isCod
    ? `Thank you. Your order ${order.orderNumber} is confirmed. Please pay ${formatGhs(order.total)} on delivery.`
    : isPaid
      ? `Thank you. We've received your payment for order ${order.orderNumber}.`
      : `Update for order ${order.orderNumber}.`;

  const html = `
    <div style="font-family:Georgia,serif;color:#1A1A2E">
      <h1 style="font-weight:normal">${siteConfig.name}</h1>
      <p>${bodyIntro}</p>
      <p><strong>Total:</strong> ${formatGhs(order.total)}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p style="color:#666;font-size:13px">Save your order number: ${order.orderNumber}</p>
    </div>
  `;

  if (!resend) {
    console.info("[email:buyer]", subject, order.email);
    return { ok: true, mocked: true };
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Lit Perfumes <onboarding@resend.dev>",
    to: order.email,
    subject,
    html,
  });
  return { ok: true, mocked: false };
}

export async function sendTeamOrderEmail(order: StoredOrder) {
  const resend = getResend();
  const to = process.env.ADMIN_EMAIL;
  if (!to) {
    console.info("[email:team] ADMIN_EMAIL not set", order.orderNumber);
    return { ok: false };
  }

  const subject = `New order ${order.orderNumber} — ${order.status}`;
  const html = `
    <div style="font-family:sans-serif">
      <p>New Lit Perfumes order</p>
      <ul>
        <li>Order: ${order.orderNumber}</li>
        <li>Customer: ${order.customerName}</li>
        <li>Phone: ${order.phone}</li>
        <li>Email: ${order.email}</li>
        <li>Total: ${formatGhs(order.total)}</li>
        <li>Method: ${order.paymentMethod}</li>
        <li>Status: ${order.status}</li>
      </ul>
    </div>
  `;

  if (!resend) {
    console.info("[email:team]", subject, to);
    return { ok: true, mocked: true };
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Lit Perfumes <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
  return { ok: true, mocked: false };
}
