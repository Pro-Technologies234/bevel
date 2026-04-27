"use client";

// app/(auth)/login/page.tsx
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconBoltFilled,
  IconBrandGithub,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BevelIcon, BrandMark } from "../shared/brand-mark";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });

    if (error) {
      setError(error.message ?? "Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleGitHub() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: callbackUrl,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-8">
          <BevelIcon className=" size-8 mb-6" />
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your Bevel account
            </p>
          </div>

          {/* GitHub */}
          <Button
            variant="outline"
            className="w-full gap-2 mb-5 p-5 rounded-full"
            onClick={handleGitHub}
            type="button"
          >
            <IconBrandGithub size={16} />
            Continue with GitHub
          </Button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 rounded-full px-4"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 rounded-full px-4"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full gap-2 rounded-full p-5"
              disabled={loading}
            >
              {loading && <IconLoader2 size={14} className="animate-spin" />}
              Sign in
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
