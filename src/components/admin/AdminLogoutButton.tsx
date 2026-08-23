"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
    } finally {
      setLoading(false);
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={logout}
      disabled={loading}
    >
      {loading ? "Signing out…" : "Log out"}
    </button>
  );
}
