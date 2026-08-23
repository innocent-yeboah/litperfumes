"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Login failed");
      return;
    }
    router.refresh();
    router.push("/admin");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-16 max-w-sm space-y-4">
      <h1 className="section-heading text-center">Admin</h1>
      <p className="text-center text-sm text-brand-navy/60">
        Owner / developer access. Set ADMIN_PASSWORD in your environment.
      </p>
      <input
        type="password"
        className="input-field"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
