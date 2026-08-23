import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { listOrders } from "@/lib/orders-store";
import { listAllProducts } from "@/lib/catalog";
import { formatGhs } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    return (
      <div className="container-lp py-12">
        <AdminLoginForm />
      </div>
    );
  }

  const [orders, products] = await Promise.all([
    listOrders(),
    listAllProducts(),
  ]);
  const openOrders = orders.filter((o) =>
    ["awaiting_payment", "paid", "cod_confirmed", "shipped"].includes(o.status)
  );

  return (
    <div className="container-lp py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="section-heading">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/orders" className="btn-secondary">
            Orders
          </Link>
          <Link href="/admin/products" className="btn-secondary">
            Products
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      {!isSupabaseConfigured() ? (
        <p className="mt-4 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Supabase is not configured — using in-memory orders and seed catalog. Set
          NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for persistence.
        </p>
      ) : null}
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="border border-brand-navy/10 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-gold">Products</p>
          <p className="mt-2 font-display text-3xl text-brand-navy">
            {products.length}
          </p>
        </div>
        <div className="border border-brand-navy/10 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-gold">Open orders</p>
          <p className="mt-2 font-display text-3xl text-brand-navy">{openOrders.length}</p>
        </div>
        <div className="border border-brand-navy/10 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-gold">All orders</p>
          <p className="mt-2 font-display text-3xl text-brand-navy">{orders.length}</p>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="font-display text-xl text-brand-navy">Recent orders</h2>
        <ul className="mt-4 divide-y divide-brand-navy/10 border border-brand-navy/10 bg-white">
          {orders.slice(0, 8).map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
            >
              <span className="font-medium">{order.orderNumber}</span>
              <span className="text-brand-navy/60">{order.customerName}</span>
              <span>{formatGhs(order.total)}</span>
              <span className="rounded-sm bg-brand-mist px-2 py-0.5 text-xs uppercase tracking-wide">
                {order.status}
              </span>
            </li>
          ))}
          {orders.length === 0 ? (
            <li className="px-4 py-8 text-center text-brand-navy/50">No orders yet.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
