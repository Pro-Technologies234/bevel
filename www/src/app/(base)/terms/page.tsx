import { Wrapper } from "@/components/shared/wrapper";
import { termsMetadata } from "@/lib/metadata";

export const metadata = termsMetadata;

const UPDATED = "August 31, 2026";

export default function TermsPage() {
  return (
    <Wrapper className="max-w-2xl mx-auto pt-28 pb-24 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-sans font-medium tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Last updated: {UPDATED}
        </p>
      </div>

      <div className="flex flex-col gap-8 text-sm text-muted-foreground leading-relaxed">
        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">1. What you're agreeing to</h2>
          <p>
            These terms cover your use of the Bevel UI website
            (bevelui.vercel.app), its documentation, and any code you obtain
            from it — whether free or paid. By installing a system, creating
            an account, or purchasing a plan, you agree to these terms.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">2. License to the code</h2>
          <p>
            All code distributed by Bevel UI — free and Pro — is provided
            under the MIT license. Once a system's source lands in your
            project via the CLI, it's yours: you may use, modify, and
            redistribute it as part of your own product, with no attribution
            requirement. A Pro or Team license controls access to Pro-tier
            systems at install time; it doesn't restrict what you do with the
            code afterward.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">3. Accounts</h2>
          <p>
            An account is only required to install Pro or Team systems and to
            manage billing. You're responsible for keeping your credentials
            secure and for activity under your account. We reserve the right
            to suspend accounts used for abuse, fraud, or license sharing
            outside the seats you've purchased.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">4. Payments</h2>
          <p>
            Paid plans are processed by Lemon Squeezy, our merchant of
            record, who handles payment collection, tax, and invoicing on
            our behalf. Lifetime purchases are one-time and non-recurring;
            monthly and yearly plans renew automatically until cancelled from
            your dashboard. Refund requests are handled case by case — email
            us and we'll sort it out.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">5. No warranty</h2>
          <p>
            Bevel UI is provided "as is." We do our best to keep every
            documented system working as described, but we don't guarantee
            it will be error-free or fit for every use case. You're
            responsible for testing code before shipping it to your own
            users, same as with any dependency.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">6. Changes</h2>
          <p>
            We may update these terms as the product changes. Material
            changes will be reflected by updating the date at the top of this
            page. Continued use after a change means you accept the updated
            terms.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground font-semibold text-base">7. Contact</h2>
          <p>
            Questions about these terms? Reach out at{" "}
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
