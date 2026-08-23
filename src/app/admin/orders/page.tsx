"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatGhs } from "@/lib/site";
import type { OrderStatus } from "@/types/product";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  codFlag: boolean;
  createdAt: string;
};

const nextActions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  paid: ["shipped", "cancelled"],
  cod_confirmed: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  awaiting_payment: ["cancelled"],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    const data = (await res.json()) as { orders: OrderRow[] };
    setOrders(data.orders);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(orderId: string, status: OrderStatus) {
    setError("");
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Update failed");
      return;
    }
    await load();
  }

  if (authed === false) {
    return (
      <div className="container-lp py-12 text-center">
        <p>Please sign in to the admin dashboard.</p>
        <Link href="/admin" className="btn-primary mt-6">
          Admin login
        </Link>
      </div>
    );
  }

  if (authed === null) {
    return <p className="container-lp py-12 text-brand-navy/60">Loading orders…</p>;
  }

  return (
    <div className="container-lp py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="section-heading">Orders</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin" className="btn-ghost">
            Dashboard
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <div className="mt-8 overflow-x-auto border border-brand-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-navy/10 bg-brand-mist/50 text-xs uppercase tracking-wide text-brand-navy/60">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-brand-navy/5">
                <td className="px-4 py-3">
                  <div className="font-medium">{order.orderNumber}</div>
                  <div className="text-xs text-brand-navy/50">{order.paymentMethod}</div>
                  {order.codFlag ? (
                    <span className="mt-1 inline-block text-[10px] uppercase tracking-wide text-brand-gold">
                      COD review
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <div>{order.customerName}</div>
                  <div className="text-xs text-brand-navy/50">{order.phone}</div>
                </td>
                <td className="px-4 py-3">{formatGhs(order.total)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-sm bg-brand-mist px-2 py-0.5 text-xs uppercase">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {(nextActions[order.status] ?? []).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="rounded-sm border border-brand-navy/20 px-2 py-1 text-xs hover:border-brand-gold"
                        onClick={() => setStatus(order.id, status)}
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 ? (
          <p className="px-4 py-8 text-center text-brand-navy/50">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
