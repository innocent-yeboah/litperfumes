import crypto from "crypto";
import { siteConfig } from "@/lib/site";

const PAYSTACK_BASE = "https://api.paystack.co";

export function paystackConfigured(): boolean {
  return Boolean(
    process.env.PAYSTACK_SECRET_KEY && process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  );
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, string>;
}): Promise<{ authorizationUrl: string; accessCode: string; reference: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      currency: "GHS",
      // Ghana: card + Mobile Money (MTN, Telecel, AirtelTigo) + bank/USSD
      channels: ["card", "mobile_money", "bank", "ussd"],
      metadata: input.metadata,
    }),
  });

  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  };

  if (!res.ok || !json.status || !json.data) {
    throw new Error(json.message || "Failed to initialize Paystack payment");
  }

  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
    reference: json.data.reference,
  };
}

export async function verifyPaystackTransaction(reference: string): Promise<{
  success: boolean;
  amount: number;
  status: string;
}> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return { success: false, amount: 0, status: "unconfigured" };
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const json = (await res.json()) as {
    status: boolean;
    data?: { status: string; amount: number };
  };

  if (!json.status || !json.data) {
    return { success: false, amount: 0, status: "failed" };
  }

  return {
    success: json.data.status === "success",
    amount: json.data.amount,
    status: json.data.status,
  };
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;

  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}

export function demoCheckoutEnabled(): boolean {
  // Hardening: when Paystack keys are present, demo is always off
  if (paystackConfigured()) {
    return false;
  }
  return process.env.NEXT_PUBLIC_DEMO_CHECKOUT !== "false";
}

export { siteConfig };
