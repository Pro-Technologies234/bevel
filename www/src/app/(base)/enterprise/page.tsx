import Link from "next/link";
import {
  IconCheck,
  IconChevronRight,
  IconMail,
  IconUsers,
  IconShieldCheck,
  IconFileInvoice,
} from "@tabler/icons-react";
import { Wrapper } from "@/components/shared/wrapper";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { enterpriseMetadata } from "@/lib/metadata";

export const metadata = enterpriseMetadata;

const TEAM_FEATURES = [
  "Everything in Pro — every current and future Pro system",
  "One shared team license key across all seats",
  "A team member management dashboard",
  "Accounting-ready invoices on request",
  "Priority support with a faster response window",
];

const REASONS = [
  {
    icon: IconUsers,
    accent: "#818cf8",
    title: "One system, every developer",
    body: "Every engineer on the team installs the same source, so your product stays visually and behaviorally consistent without a shared component package to version and publish internally.",
  },
  {
    icon: IconShieldCheck,
    accent: "#c2f13c",
    title: "No dependency to audit",
    body: "Because the code lands in your repo instead of node_modules, there's no third-party runtime package for security or license review to track release over release.",
  },
  {
    icon: IconFileInvoice,
    accent: "#f97316",
    title: "Procurement-friendly",
    body: "A single license key, one invoice, and a license that's yours to keep — no per-seat SaaS contract to renegotiate every year.",
  },
];

export default function EnterprisePage() {
  return (
    <div>
      <PageHero
        eyebrow="Enterprise"
        title="One system across your whole team."
        description="The Team plan gives every developer the same source, under one license — without the per-seat SaaS overhead a hosted component library usually comes with."
      />

      <Wrapper className="max-w-4xl mx-auto pb-24 flex flex-col gap-6">
        {/* Why teams choose Bevel */}
        <section className="grid sm:grid-cols-3 gap-4">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="p-6 rounded-2xl border flex flex-col gap-3"
              style={{
                background: `linear-gradient(180deg, ${reason.accent}14, transparent)`,
                borderColor: `${reason.accent}33`,
              }}
            >
              <div
                className="flex items-center justify-center h-10 w-10 rounded-xl"
                style={{ background: `${reason.accent}22`, color: reason.accent }}
              >
                <reason.icon size={19} strokeWidth={1.7} />
              </div>
              <h3 className="text-sm font-semibold">{reason.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {reason.body}
              </p>
            </div>
          ))}
        </section>

        {/* What's included */}
        <section className="rounded-2xl border border-border/60 bg-muted/10 overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/60">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/15 text-primary">
              <IconCheck size={14} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold">What's included in Team</span>
          </div>
          <ul className="p-6 flex flex-col gap-3">
            {TEAM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <IconCheck size={15} className="text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center text-center gap-4 pt-6 border-t border-border/60">
          <p className="text-sm text-muted-foreground max-w-md">
            See current seat limits and pricing on the pricing page, or reach
            out directly if you need something a self-serve plan doesn't
            cover — a larger seat count, a custom invoice, or procurement
            paperwork.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link href="/pricing">
              <Button variant="inverted" size="lg">
                View Team pricing <IconChevronRight />
              </Button>
            </Link>
            <a href="mailto:hello@bevelui.vercel.app">
              <Button variant="outline" size="lg">
                <IconMail size={14} /> Contact us
              </Button>
            </a>
          </div>
        </section>
      </Wrapper>
    </div>
  );
}
