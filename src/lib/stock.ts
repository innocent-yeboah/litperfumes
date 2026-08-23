import { getVariant } from "@/lib/catalog";
import { availableStock } from "@/types/product";
import {
  getReserved,
  releaseVariant,
  reserveVariant,
} from "@/lib/orders-store";
import {
  createServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export type StockLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function getAvailable(
  variantId: string,
  productId: string
): Promise<number> {
  if (isSupabaseConfigured() && isUuid(variantId)) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("product_variants")
      .select("on_hand, reserved")
      .eq("id", variantId)
      .maybeSingle();
    if (!error && data) {
      return Math.max(0, Number(data.on_hand) - Number(data.reserved));
    }
  }

  const found = await getVariant(productId, variantId);
  if (!found) return 0;
  const base = availableStock(found.variant);
  const runtime = getReserved(variantId);
  return Math.max(0, base - runtime);
}

/**
 * Hard Rule 1 — reserve stock atomically on order create.
 */
export async function tryReserveLines(
  lines: StockLine[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (isSupabaseConfigured() && lines.every((l) => isUuid(l.variantId))) {
    const supabase = createServiceClient();
    const reserved: StockLine[] = [];
    for (const line of lines) {
      const { data, error } = await supabase.rpc("reserve_stock", {
        p_variant_id: line.variantId,
        p_qty: line.quantity,
      });
      if (error || data !== true) {
        // roll back prior reservations
        for (const prev of reserved) {
          await supabase.rpc("release_stock", {
            p_variant_id: prev.variantId,
            p_qty: prev.quantity,
          });
        }
        return {
          ok: false,
          error: `Insufficient stock for one or more items.`,
        };
      }
      reserved.push(line);
    }
    return { ok: true };
  }

  // Memory fallback
  for (const line of lines) {
    const avail = await getAvailable(line.variantId, line.productId);
    if (line.quantity > avail) {
      return {
        ok: false,
        error: `Insufficient stock (need ${line.quantity}, available ${avail}).`,
      };
    }
  }
  for (const line of lines) {
    reserveVariant(line.variantId, line.quantity);
  }
  return { ok: true };
}

export async function releaseLines(
  lines: Array<{ variantId: string; quantity: number }>
) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    for (const line of lines) {
      if (!isUuid(line.variantId)) {
        releaseVariant(line.variantId, line.quantity);
        continue;
      }
      await supabase.rpc("release_stock", {
        p_variant_id: line.variantId,
        p_qty: line.quantity,
      });
    }
    return;
  }
  for (const line of lines) {
    releaseVariant(line.variantId, line.quantity);
  }
}
