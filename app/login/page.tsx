"use client";

import { FormEvent, Suspense, useState } from "react";
import { LockKeyhole, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Login failed");
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const signupSuccess = searchParams.get("signup") === "success";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50 p-5">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-violet-100">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg">
              <Sparkles size={25} />
            </div>
          </Link>

          <h1 className="mt-5 text-3xl font-black">Welcome to LOOP</h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to your feedback workspace
          </p>
        </div>

        {signupSuccess && (
          <div className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-600">
            Account created successfully. Please sign in with your email and
            password.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-600">
              Email
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-600">
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-violet-600 hover:text-violet-700"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50">
          <div className="text-sm font-semibold text-slate-500">
            Loading LOOP...
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}