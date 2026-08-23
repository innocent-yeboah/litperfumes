"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/product";
import { shippingForSubtotal } from "@/lib/site";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const quantity = item.quantity ?? 1;
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.variantId === item.variantId
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },
      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.priceGhs * item.quantity,
          0
        ),
      getShipping: () => shippingForSubtotal(get().getSubtotal()),
      getTotal: () => get().getSubtotal() + get().getShipping(),
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: "lit-perfumes-cart" }
  )
);
