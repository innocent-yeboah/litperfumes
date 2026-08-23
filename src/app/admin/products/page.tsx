"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatGhs } from "@/lib/site";
import { availableStock, type Product } from "@/types/product";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

type StockDraft = Record<string, { onHand: string; priceGhs: string }>;

type CreateForm = {
  brand: string;
  name: string;
  slug: string;
  description: string;
  concentration: string;
  gender: "Women" | "Men" | "Unisex";
  sizeMl: string;
  priceGhs: string;
  sku: string;
  onHand: string;
  imageUrl: string;
};

const emptyCreate: CreateForm = {
  brand: "",
  name: "",
  slug: "",
  description: "",
  concentration: "Eau de Parfum",
  gender: "Unisex",
  sizeMl: "100",
  priceGhs: "",
  sku: "",
  onHand: "5",
  imageUrl: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [supabase, setSupabase] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [drafts, setDrafts] = useState<StockDraft>({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreate);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    const data = (await res.json()) as {
      products: Product[];
      supabase?: boolean;
    };
    setProducts(data.products);
    setSupabase(Boolean(data.supabase));
    const next: StockDraft = {};
    for (const p of data.products) {
      for (const v of p.variants) {
        next[v.id] = {
          onHand: String(v.onHand),
          priceGhs: String(v.priceGhs),
        };
      }
    }
    setDrafts(next);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveVariant(variantId: string) {
    const draft = drafts[variantId];
    if (!draft) return;
    setSaving(variantId);
    setMessage("");
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variantId,
        onHand: Number(draft.onHand),
        priceGhs: Number(draft.priceGhs),
      }),
    });
    setSaving(null);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setMessage(data.error ?? "Could not save");
      return;
    }
    setMessage("Saved.");
    await load();
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setMessage("");
    const slug =
      createForm.slug.trim() ||
      `${createForm.brand}-${createForm.name}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: createForm.brand.trim(),
        name: createForm.name.trim(),
        slug,
        description: createForm.description.trim() || createForm.name.trim(),
        concentration: createForm.concentration.trim() || "Eau de Parfum",
        notesTop: [],
        notesMid: [],
        notesBase: [],
        images: createForm.imageUrl.trim()
          ? [createForm.imageUrl.trim()]
          : [],
        featured: false,
        active: true,
        gender: createForm.gender,
        variants: [
          {
            sizeMl: Number(createForm.sizeMl),
            priceGhs: Number(createForm.priceGhs),
            sku: createForm.sku.trim(),
            onHand: Number(createForm.onHand),
          },
        ],
      }),
    });
    setCreating(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string | object };
      setMessage(
        typeof data.error === "string"
          ? data.error
          : "Could not create product"
      );
      return;
    }
    setMessage("Product created.");
    setCreateForm(emptyCreate);
    setShowCreate(false);
    await load();
  }

  if (authed === false) {
    return (
      <div className="container-lp py-12 text-center">
        <Link href="/admin" className="btn-primary">
          Admin login
        </Link>
      </div>
    );
  }

  if (authed === null) {
    return <p className="container-lp py-12">Loading products…</p>;
  }

  return (
    <div className="container-lp py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="section-heading">Products</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin" className="btn-ghost">
            Dashboard
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <p className="mt-3 text-sm text-brand-navy/60">
        {supabase
          ? "Create products and edit stock/prices in Supabase."
          : "Showing seed catalog (read-only). Connect Supabase to create products and edit stock."}
      </p>
      {message ? <p className="mt-3 text-sm text-brand-navy/80">{message}</p> : null}

      {supabase ? (
        <div className="mt-6">
          {!showCreate ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowCreate(true)}
            >
              Add product
            </button>
          ) : (
            <form
              onSubmit={createProduct}
              className="space-y-4 border border-brand-navy/10 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-brand-navy">
                  New product
                </h2>
                <button
                  type="button"
                  className="btn-ghost text-sm"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  Brand
                  <input
                    required
                    className="input-field mt-1"
                    value={createForm.brand}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, brand: e.target.value }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  Name
                  <input
                    required
                    className="input-field mt-1"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  Slug (optional)
                  <input
                    className="input-field mt-1"
                    placeholder="auto from brand + name"
                    value={createForm.slug}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, slug: e.target.value }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  Gender
                  <select
                    className="input-field mt-1"
                    value={createForm.gender}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        gender: e.target.value as CreateForm["gender"],
                      }))
                    }
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </label>
                <label className="block text-sm sm:col-span-2">
                  Description
                  <textarea
                    className="input-field mt-1 min-h-[80px]"
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  Concentration
                  <input
                    className="input-field mt-1"
                    value={createForm.concentration}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        concentration: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  Image URL
                  <input
                    className="input-field mt-1"
                    value={createForm.imageUrl}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        imageUrl: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  Size (ml)
                  <input
                    required
                    type="number"
                    min={1}
                    className="input-field mt-1"
                    value={createForm.sizeMl}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, sizeMl: e.target.value }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  Price (GHS)
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    className="input-field mt-1"
                    value={createForm.priceGhs}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        priceGhs: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  SKU
                  <input
                    required
                    className="input-field mt-1"
                    value={createForm.sku}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, sku: e.target.value }))
                    }
                  />
                </label>
                <label className="block text-sm">
                  On hand
                  <input
                    required
                    type="number"
                    min={0}
                    className="input-field mt-1"
                    value={createForm.onHand}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, onHand: e.target.value }))
                    }
                  />
                </label>
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={creating}
              >
                {creating ? "Creating…" : "Create product"}
              </button>
            </form>
          )}
        </div>
      ) : null}

      <div className="mt-8 overflow-x-auto border border-brand-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-navy/10 bg-brand-mist/50 text-xs uppercase tracking-wide text-brand-navy/60">
            <tr>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Variants / stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-brand-navy/5 align-top"
              >
                <td className="px-4 py-3">{product.brand}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-brand-navy/50">{product.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-3">
                    {product.variants.map((v) => (
                      <li key={v.id} className="space-y-1">
                        <div>
                          {v.sizeMl}ml — available {availableStock(v)} (SKU {v.sku})
                        </div>
                        {supabase ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="text-xs text-brand-navy/60">
                              On hand
                              <input
                                className="input-field ml-1 w-20 py-1"
                                value={drafts[v.id]?.onHand ?? ""}
                                onChange={(e) =>
                                  setDrafts((d) => ({
                                    ...d,
                                    [v.id]: {
                                      onHand: e.target.value,
                                      priceGhs: d[v.id]?.priceGhs ?? String(v.priceGhs),
                                    },
                                  }))
                                }
                              />
                            </label>
                            <label className="text-xs text-brand-navy/60">
                              Price
                              <input
                                className="input-field ml-1 w-24 py-1"
                                value={drafts[v.id]?.priceGhs ?? ""}
                                onChange={(e) =>
                                  setDrafts((d) => ({
                                    ...d,
                                    [v.id]: {
                                      onHand: d[v.id]?.onHand ?? String(v.onHand),
                                      priceGhs: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </label>
                            <button
                              type="button"
                              className="rounded-sm border border-brand-navy/20 px-2 py-1 text-xs hover:border-brand-gold"
                              disabled={saving === v.id}
                              onClick={() => saveVariant(v.id)}
                            >
                              {saving === v.id ? "Saving…" : "Save"}
                            </button>
                            <span className="text-xs text-brand-navy/50">
                              {formatGhs(v.priceGhs)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-brand-navy/50">
                            {formatGhs(v.priceGhs)} · on hand {v.onHand}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
