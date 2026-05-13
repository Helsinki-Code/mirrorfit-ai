"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-panel p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-text-strong">Welcome Back</h1>
        <p className="mb-6 text-sm text-muted">Sign in to your MirrorFit AI workspace.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email address"
            className="subtle-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="subtle-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          onClick={async () => {
            setError("");
            setLoading(true);
            try {
              await signInWithGoogle();
              router.replace("/dashboard");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Google sign-in failed.");
            } finally {
              setLoading(false);
            }
          }}
          className="mt-3 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text"
        >
          Continue with Google
        </button>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/reset-password" className="text-primary">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-primary">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
