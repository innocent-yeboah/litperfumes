import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminSessionToken } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { password?: string };
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) {
    return NextResponse.json(
      { error: "Set ADMIN_PASSWORD in environment to enable admin login." },
      { status: 503 }
    );
  }
  if ((body.password ?? "").trim() !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const sessionToken = getAdminSessionToken();
  if (!sessionToken) {
    return NextResponse.json(
      { error: "Admin session could not be created." },
      { status: 503 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
