import { z } from "zod";
import { siteConfig, formatGhs } from "@/lib/site";

export const checkoutSchema = z
  .object({
    customerName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    emailConfirm: z.string().email("Confirm your email"),
    phone: z.string().min(10, "Enter a valid phone number"),
    addressLine1: z.string().min(5, "Enter your street address"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "Enter your city"),
    state: z.string().min(2, "Enter your state / region"),
    country: z.string().min(2, "Enter your country"),
    giftNote: z.string().max(300).optional(),
    paymentMethod: z.enum(["paystack", "cod"]),
  })
  .refine((data) => data.email === data.emailConfirm, {
    message: "Emails must match",
    path: ["emailConfirm"],
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function assertCodAllowed(total: number, method: "paystack" | "cod") {
  if (method === "cod" && total > siteConfig.codMaxGhs) {
    return `Cash on delivery is only available for orders up to ${formatGhs(siteConfig.codMaxGhs)}. Please pay online.`;
  }
  return null;
}
