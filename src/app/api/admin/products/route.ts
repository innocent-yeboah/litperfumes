import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  listAllProducts,
  updateVariantStock,
  upsertProduct,
} from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await listAllProducts();
  return NextResponse.json({
    products,
    supabase: isSupabaseConfigured(),
  });
}

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  brand: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  concentration: z.string(),
  notesTop: z.array(z.string()).default([]),
  notesMid: z.array(z.string()).default([]),
  notesBase: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  gender: z.enum(["Women", "Men", "Unisex"]),
  variants: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        sizeMl: z.number().positive(),
        priceGhs: z.number().nonnegative(),
        sku: z.string().min(1),
        onHand: z.number().int().nonnegative(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await req.json();
  const parsed = upsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const result = await upsertProduct(parsed.data);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ product: result.product });
}

const stockSchema = z.object({
  variantId: z.string().min(1),
  onHand: z.number().int().nonnegative(),
  priceGhs: z.number().nonnegative().optional(),
});

export async function PATCH(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await req.json();
  const parsed = stockSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const result = await updateVariantStock(parsed.data);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
