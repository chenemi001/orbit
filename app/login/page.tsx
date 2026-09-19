"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ||
            "Unable to log you in. Please check your credentials.",
        );
        return;
      }

      window.location.assign("/dashboard");
    } catch {
      setError(
        "Unable to connect to Orbit. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =========================================
            LEFT BRAND PANEL
        ========================================== */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[var(--foreground)]" />

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--accent)] opacity-30 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-[var(--accent)] opacity-20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-[var(--background)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--background)]/20">
                O
              </span>

              Orbit
            </Link>

            <div className="max-w-xl">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--background)]/50">
                Welcome back
              </p>

              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--background)] xl:text-5xl">
                Pick up where you left off.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-[var(--background)]/60">
                Your projects, tasks, team and AI workspace
                are waiting for you.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Your projects stay organized",
                  "Your team stays aligned",
                  "Your work stays in motion",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[var(--background)]/70"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--background)]/15">
                      <Check className="h-3.5 w-3.5" />
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[var(--background)]/35">
              © {new Date().getFullYear()} Orbit. All
              rights reserved.
            </p>
          </div>
        </section>

        {/* =========================================
            LOGIN FORM
        ========================================== */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <Link
              href="/"
              className="mb-10 flex items-center gap-2 text-sm font-semibold lg:hidden"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)]">
                O
              </span>

              Orbit
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-[var(--muted)]">
                Welcome back
              </p>

              <h2 className="text-3xl font-semibold tracking-tight">
                Log in to Orbit
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Enter your details to access your
                workspace.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              {/* EMAIL */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="text-sm font-medium"
                >
                  Email address
                </label>

                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    disabled={isLoading}
                    className="text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] disabled:opacity-50"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    disabled={isLoading}
                    className="pr-11"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="rounded-[var(--radius)] border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3 py-2.5 text-sm text-[var(--danger)]"
                >
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Log in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* REGISTER */}
              <p className="text-center text-sm text-[var(--muted)]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}