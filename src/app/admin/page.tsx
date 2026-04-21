"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Login failed.");
      setIsSubmitting(false);
      return;
    }

    const nextPath = searchParams.get("next") || "/recipes/new";
    router.push(nextPath);
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-700">Admin Login</h1>
        <p className="text-zinc-600">Sign in to add new recipes.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">
            Admin password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 p-2"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in as admin"}
        </button>
      </form>
    </main>
  );
}
