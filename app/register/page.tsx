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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordLengthValid = password.length >= 8;

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password,
            confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ||
            "Unable to create your account. Please try again.",
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
                Your work, in orbit.
              </p>

              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--background)] xl:text-5xl">
                Bring your team&apos;s work together.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-[var(--background)]/60">
                Plan projects, organize tasks, collaborate
                with your team, and keep everything moving
                from one focused workspace.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Organize projects and tasks",
                  "Collaborate with your team",
                  "Work smarter with AI",
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
            REGISTER FORM
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
                Get started
              </p>

              <h2 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Create your Orbit workspace and start
                organizing your work.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              {/* NAME */}
              <div className="space-y-2">
                <label
                  htmlFor="register-name"
                  className="text-sm font-medium"
                >
                  Full name
                </label>

                <Input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label
                  htmlFor="register-email"
                  className="text-sm font-medium"
                >
                  Email address
                </label>

                <Input
                  id="register-email"
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
                <label
                  htmlFor="register-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <Input
                    id="register-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    disabled={isLoading}
                    className="pr-11"
                    error={
                      password.length > 0 &&
                      !passwordLengthValid
                    }
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

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <label
                  htmlFor="register-confirm-password"
                  className="text-sm font-medium"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    disabled={isLoading}
                    className="pr-11"
                    error={
                      confirmPassword.length > 0 &&
                      !passwordsMatch
                    }
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current,
                      )
                    }
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* PASSWORD CHECKS */}
              <div className="space-y-2">
                <div
                  className={`flex items-center gap-2 text-xs ${
                    passwordLengthValid
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      passwordLengthValid
                        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {passwordLengthValid && (
                      <Check className="h-2.5 w-2.5" />
                    )}
                  </span>

                  At least 8 characters
                </div>

                <div
                  className={`flex items-center gap-2 text-xs ${
                    passwordsMatch
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      passwordsMatch
                        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {passwordsMatch && (
                      <Check className="h-2.5 w-2.5" />
                    )}
                  </span>

                  Passwords match
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* LOGIN LINK */}
              <p className="text-center text-sm text-[var(--muted)]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-[var(--muted)]">
              By creating an account, you agree to
              Orbit&apos;s terms and privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}