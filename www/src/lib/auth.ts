// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ── Email & Password ──────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },

  // ── Email verification ────────────────────────────────────────────────────
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Wire up to your email provider (Resend, SendGrid, etc.)
      // For now, log to console in dev
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] Verification email for ${user.email}: ${url}`);
        return;
      }
      // Production: use Resend
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Bevel UI <noreply@bevelui.com>",
        to: user.email,
        subject: "Verify your Bevel UI account",
        html: `
          <div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:40px 20px">
            <h2 style="color:#0a0a0a;font-size:24px;font-weight:700;margin-bottom:16px">
              Verify your email
            </h2>
            <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:24px">
              Click the button below to verify your Bevel UI account.
            </p>
            <a href="${url}" style="display:inline-block;background:#c2f13c;color:#0a0a0a;font-weight:700;font-size:15px;padding:12px 28px;border-radius:8px;text-decoration:none">
              Verify email
            </a>
            <p style="color:#999;font-size:13px;margin-top:24px">
              If you didn't create an account, ignore this email.
            </p>
          </div>
        `,
      });
    },
  },

  // ── Social providers ──────────────────────────────────────────────────────
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  // ── Session ───────────────────────────────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minute cookie cache
    },
  },

  // ── Advanced ─────────────────────────────────────────────────────────────
  advanced: {
    database: {
      generateId: () => {
        // Use cuid2 for consistent IDs with Prisma default
        const { createId } = require("@paralleldrive/cuid2");
        return createId();
      },
    },
  },

  // ── Trusted origins ───────────────────────────────────────────────────────
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
