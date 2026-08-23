import type { Product, ProductVariant } from "@/types/product";
import {
  seedProducts,
  getProductBySlug as seedGetBySlug,
  getProductById as seedGetById,
  getFeaturedProducts as seedFeatured,
  getBrands as seedBrands,
  getVariant as seedGetVariant,
} from "@/data/products";
import {
  createAnonClient,
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

type DbProduct = {
  id: string;
  brand: string;
  name: string;
  slug: string;
  description: string;
  concentration: string;
  notes_top: string[];
  notes_mid: string[];
  notes_base: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  gender: string;
  product_variants?: DbVariant[];
};

type DbVariant = {
  id: string;
  product_id: string;
  size_ml: number;
  price_ghs: number | string;
  sku: string;
  on_hand: number;
  reserved: number;
};

function mapVariant(v: DbVariant): ProductVariant {
  return {
    id: v.id,
    sizeMl: v.size_ml,
    priceGhs: Number(v.price_ghs),
    sku: v.sku,
    onHand: v.on_hand,
    reserved: v.reserved,
  };
}

function mapProduct(row: DbProduct): Product {
  const gender =
    row.gender === "Women" || row.gender === "Men" || row.gender === "Unisex"
      ? row.gender
      : "Unisex";
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    slug: row.slug,
    description: row.description,
    concentration: row.concentration,
    notesTop: row.notes_top ?? [],
    notesMid: row.notes_mid ?? [],
    notesBase: row.notes_base ?? [],
    images: row.images ?? [],
    featured: row.featured,
    active: row.active,
    gender,
    variants: (row.product_variants ?? []).map(mapVariant),
  };
}

const variantSelect =
  "id, product_id, size_ml, price_ghs, sku, on_hand, reserved";

export async function listActiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return seedProducts.filter((p) => p.active);
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, product_variants(${variantSelect})`)
    .eq("active", true)
    .order("brand");
  if (error) {
    console.error("[catalog] listActiveProducts", error.message);
    return seedProducts.filter((p) => p.active);
  }
  return (data as DbProduct[]).map(mapProduct);
}

export async function listAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [...seedProducts];
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, product_variants(${variantSelect})`)
    .order("brand");
  if (error) {
    console.error("[catalog] listAllProducts", error.message);
    return [...seedProducts];
  }
  return (data as DbProduct[]).map(mapProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return seedGetBySlug(slug);
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, product_variants(${variantSelect})`)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("[catalog] getProductBySlug", error.message);
    return seedGetBySlug(slug);
  }
  return mapProduct(data as DbProduct);
}

export async function getProductById(
  id: string
): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return seedGetById(id);
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, product_variants(${variantSelect})`)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("[catalog] getProductById", error.message);
    return seedGetById(id);
  }
  return mapProduct(data as DbProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return seedFeatured();
  }
  const products = await listActiveProducts();
  return products.filter((p) => p.featured);
}

export async function getBrands(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return seedBrands();
  }
  const products = await listActiveProducts();
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export async function getVariant(
  productId: string,
  variantId: string
): Promise<{ product: Product; variant: ProductVariant } | undefined> {
  if (!isSupabaseConfigured()) {
    return seedGetVariant(productId, variantId);
  }
  const product = await getProductById(productId);
  if (!product) return undefined;
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return undefined;
  return { product, variant };
}

export type UpsertProductInput = {
  id?: string;
  brand: string;
  name: string;
  slug: string;
  description: string;
  concentration: string;
  notesTop: string[];
  notesMid: string[];
  notesBase: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  gender: "Women" | "Men" | "Unisex";
  variants: Array<{
    id?: string;
    sizeMl: number;
    priceGhs: number;
    sku: string;
    onHand: number;
  }>;
};

export async function upsertProduct(
  input: UpsertProductInput
): Promise<{ product?: Product; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }
  const supabase = createServiceClient();

  const productRow = {
    brand: input.brand,
    name: input.name,
    slug: input.slug,
    description: input.description,
    concentration: input.concentration,
    notes_top: input.notesTop,
    notes_mid: input.notesMid,
    notes_base: input.notesBase,
    images: input.images,
    featured: input.featured,
    active: input.active,
    gender: input.gender,
    updated_at: new Date().toISOString(),
  };

  let productId = input.id;
  if (productId) {
    const { error } = await supabase
      .from("products")
      .update(productRow)
      .eq("id", productId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(productRow)
      .select("id")
      .single();
    if (error || !data) return { error: error?.message ?? "Insert failed" };
    productId = data.id as string;
  }

  for (const v of input.variants) {
    const variantRow = {
      product_id: productId,
      size_ml: v.sizeMl,
      price_ghs: v.priceGhs,
      sku: v.sku,
      on_hand: v.onHand,
    };
    if (v.id) {
      const { error } = await supabase
        .from("product_variants")
        .update(variantRow)
        .eq("id", v.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("product_variants").insert({
        ...variantRow,
        reserved: 0,
      });
      if (error) return { error: error.message };
    }
  }

  const product = await getProductById(productId);
  return { product };
}

export async function updateVariantStock(input: {
  variantId: string;
  onHand: number;
  priceGhs?: number;
}): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }
  const supabase = createServiceClient();
  const patch: Record<string, number> = { on_hand: input.onHand };
  if (typeof input.priceGhs === "number") {
    patch.price_ghs = input.priceGhs;
  }
  const { error } = await supabase
    .from("product_variants")
    .update(patch)
    .eq("id", input.variantId);
  if (error) return { error: error.message };
  return {};
}
