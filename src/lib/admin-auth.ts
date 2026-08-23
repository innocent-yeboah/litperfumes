import { cookies } from "next/headers";

export const ADMIN_COOKIE = "lp_admin_session";

/** Prefer session secret; fall back to password. Treat blank env as unset. */
export function getAdminSessionToken(): string | undefined {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret) return secret;
  const password = process.env.ADMIN_PASSWORD?.trim();
  return password || undefined;
}

export function isAdminAuthenticated(): boolean {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const expected = getAdminSessionToken();
  if (!expected || !token) return false;
  return token === expected;
}

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}
