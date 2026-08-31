import { Wrapper } from "@/components/shared/wrapper";
import { privacyMetadata } from "@/lib/metadata";

export const metadata = privacyMetadata;

const UPDATED = "August 31, 2026";

export default function PrivacyPage() {
  return (
    <Wrapper className="max-w-2xl mx-auto pt-28 pb-24 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-sans font-medium tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Last updated: {UPDATED}
        </p>
      </div>

      <div className="flex flex-col gap-8 text-sm text-muted-foreground leading-relaxed">
        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">The short version</h2>
          <p>
            Browsing the docs and installing free systems requires no
            account and collects nothing beyond standard hosting logs. An
            account only exists to unlock Pro/Team systems and manage
            billing, and we only store what's needed to do that.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">What we collect</h2>
          <p>
            If you create an account: your email address, and — if you sign
            in with GitHub — the public profile information GitHub shares
            during authentication. If you purchase a plan: the billing
            details required to process payment, which are collected and
            stored by our payment processor, Lemon Squeezy, not by us
            directly — we never see or store your card number.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">What we don't collect</h2>
          <p>
            We don't track what you build with the code you install, don't
            add analytics or telemetry to any system you copy into your
            project, and don't sell or share your data with advertisers.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">Third-party services</h2>
          <p>
            The site runs on Vercel, authentication is handled by Better
            Auth (optionally via GitHub OAuth), and payments are processed
            by Lemon Squeezy. Each of these processes the minimum data
            required to do its job, under their own privacy policies.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">Cookies</h2>
          <p>
            We use only the cookies required to keep you signed in and to
            remember your theme preference. No third-party advertising or
            cross-site tracking cookies are set by this site.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">Your rights</h2>
          <p>
            You can request a copy of your account data, or request deletion
            of your account and associated data, at any time by emailing us.
            We'll action deletion requests within a reasonable timeframe,
            except where billing records must be retained for tax or legal
            reasons.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">Contact</h2>
          <p>
            Questions about this policy, or a data request? Email{" "}
            <a
              href="mailto:hello@bevelui.vercel.app"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              hello@bevelui.vercel.app
            </a>
            .
          </p>
        </section>
      </div>
    </Wrapper>
  );
}
