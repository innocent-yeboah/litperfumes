/**
 * Seed Lit Perfumes catalog into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-products.ts
 *
 * Or with .env.local loaded via dotenv if preferred.
 */

import { createClient } from "@supabase/supabase-js";
import { seedProducts } from "../src/data/products";

async function main() {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY"
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Seeding ${seedProducts.length} products…`);

  for (const product of seedProducts) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", product.slug)
      .maybeSingle();

    let productId = existing?.id as string | undefined;

    const productRow = {
      brand: product.brand,
      name: product.name,
      slug: product.slug,
      description: product.description,
      concentration: product.concentration,
      notes_top: product.notesTop,
      notes_mid: product.notesMid,
      notes_base: product.notesBase,
      images: product.images,
      featured: product.featured,
      active: product.active,
      gender: product.gender,
      updated_at: new Date().toISOString(),
    };

    if (productId) {
      const { error } = await supabase
        .from("products")
        .update(productRow)
        .eq("id", productId);
      if (error) {
        console.error(`Update product ${product.slug}:`, error.message);
        continue;
      }
      console.log(`Updated product ${product.slug}`);
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(productRow)
        .select("id")
        .single();
      if (error || !data) {
        console.error(`Insert product ${product.slug}:`, error?.message);
        continue;
      }
      productId = data.id as string;
      console.log(`Inserted product ${product.slug}`);
    }

    for (const v of product.variants) {
      const { data: existingVariant } = await supabase
        .from("product_variants")
        .select("id")
        .eq("sku", v.sku)
        .maybeSingle();

      const variantRow = {
        product_id: productId,
        size_ml: v.sizeMl,
        price_ghs: v.priceGhs,
        sku: v.sku,
        on_hand: v.onHand,
        reserved: 0,
      };

      if (existingVariant?.id) {
        const { error } = await supabase
          .from("product_variants")
          .update(variantRow)
          .eq("id", existingVariant.id);
        if (error) {
          console.error(`  Update variant ${v.sku}:`, error.message);
        } else {
          console.log(`  Updated variant ${v.sku}`);
        }
      } else {
        const { error } = await supabase
          .from("product_variants")
          .insert(variantRow);
        if (error) {
          console.error(`  Insert variant ${v.sku}:`, error.message);
        } else {
          console.log(`  Inserted variant ${v.sku}`);
        }
      }
    }
  }

  const keepSlugs = seedProducts.map((p) => p.slug);
  const { data: allProducts, error: listError } = await supabase
    .from("products")
    .select("id, slug, active");
  if (listError) {
    console.error("Could not list products for cleanup:", listError.message);
  } else {
    for (const row of allProducts ?? []) {
      if (!keepSlugs.includes(row.slug as string) && row.active) {
        const { error } = await supabase
          .from("products")
          .update({ active: false, updated_at: new Date().toISOString() })
          .eq("id", row.id);
        if (error) {
          console.error(`Deactivate ${row.slug}:`, error.message);
        } else {
          console.log(`Deactivated legacy product ${row.slug}`);
        }
      }
    }
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
