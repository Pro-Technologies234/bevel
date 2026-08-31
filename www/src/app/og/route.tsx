// app/og/route.tsx
// Dynamic OG image generation using @vercel/og
// Generates all OG images at request time — no need to manually create PNGs
//
// Usage:
//   /og?type=default
//   /og?type=docs
//   /og?type=system&name=Product+Tour&description=Overlay+masking...
//   /og?type=lab&name=Vault&tagline=File+manager
//   /og?type=pricing
//   /og?type=labs
//
// Install: bun add @vercel/og
//
// Then update your metadata to use dynamic URLs instead of static PNGs:
//   og("og-default.webp")  →  `${SITE_URL}/og?type=default`

import { BevelIcon } from "@/components/shared/brand-mark";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const LIME = "#c2f13c";
const BLACK = "#080808";
const DARK = "#111111";
const GRAY = "rgba(255,255,255,0.35)";
const BORDER = "rgba(255,255,255,0.08)";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BevelLogo() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: LIME,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BevelIcon width={20} height={20} />
    </div>
  );
}

function Label({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontFamily: "monospace",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: LIME,
        opacity: 0.8,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <div style={{ width: 20, height: 1, background: LIME }} />
      {children}
    </div>
  );
}

// ─── OG variants ─────────────────────────────────────────────────────────────

function DefaultOG() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BLACK,
        display: "flex",
        flexDirection: "column",
        padding: 64,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, rgba(194,241,60,0.12) 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: "auto",
        }}
      >
        <BevelLogo />
        <span
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.3px",
          }}
        >
          Bevel UI
        </span>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: 0, zIndex: 1 }}
      >
        <Label>Engineering-First UI Systems</Label>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            margin: 0,
            marginBottom: 24,
          }}
        >
          The UI Systems
          <br />
          Your App <span style={{ color: LIME }}>Actually</span>
          <br />
          Needs.
        </h1>
        <p
          style={{
            fontSize: 20,
            color: GRAY,
            fontWeight: 300,
            margin: 0,
            maxWidth: 560,
          }}
        >
          Copy-to-own systems for React. No lock-in. shadcn compatible.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
        {["Product Tour", "Command Palette", "File Upload", "Form Engine"].map(
          (s) => (
            <div
              key={s}
              style={{
                background: "rgba(194,241,60,0.08)",
                border: "1px solid rgba(194,241,60,0.2)",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                color: LIME,
                fontWeight: 600,
              }}
            >
              {s}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function SystemOG({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BLACK,
        display: "flex",
        padding: 64,
        gap: 48,
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(194,241,60,0.08) 0%, transparent 70%)`,
          top: "50%",
          left: "60%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        style={{ display: "flex", flexDirection: "column", flex: 1, zIndex: 1 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 40,
          }}
        >
          <BevelLogo />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
            Bevel UI
          </span>
        </div>

        <Label>System</Label>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            margin: 0,
            marginBottom: 20,
          }}
        >
          {name}
        </h1>
        <p
          style={{
            fontSize: 18,
            color: GRAY,
            fontWeight: 300,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>

        <div
          style={{
            marginTop: 32,
            padding: "10px 20px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            fontSize: 14,
            color: LIME,
            fontFamily: "monospace",
            display: "inline-flex",
            width: "fit-content",
          }}
        >
          {`npx shadcn@latest add https://bevelui.vercel.app/r/${name.toLowerCase().replace(" ", "-")}.json`}
        </div>
      </div>
    </div>
  );
}

function LabOG({ name, tagline }: { name: string; tagline: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BLACK,
        display: "flex",
        flexDirection: "column",
        padding: 64,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "auto",
          zIndex: 1,
        }}
      >
        <BevelLogo />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
          Bevel Labs
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
        <Label>Live demo</Label>
        <h1
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "white",
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            margin: 0,
            marginBottom: 16,
          }}
        >
          {name}
        </h1>
        <p style={{ fontSize: 22, color: GRAY, margin: 0, fontWeight: 300 }}>
          {tagline}
        </p>
      </div>
    </div>
  );
}

function PricingOG() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BLACK,
        display: "flex",
        flexDirection: "column",
        padding: 64,
        position: "relative",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, rgba(194,241,60,0.07) 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 40,
          zIndex: 1,
        }}
      >
        <BevelLogo />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
          Bevel UI
        </span>
      </div>

      <h1
        style={{
          fontSize: 80,
          fontWeight: 900,
          color: "white",
          letterSpacing: "-0.05em",
          margin: 0,
          marginBottom: 16,
          zIndex: 1,
        }}
      >
        Simple pricing.
      </h1>
      <p
        style={{
          fontSize: 22,
          color: GRAY,
          margin: 0,
          fontWeight: 300,
          zIndex: 1,
        }}
      >
        Free forever or $49 one-time. No subscription required.
      </p>

      <div style={{ display: "flex", gap: 16, marginTop: 48, zIndex: 1 }}>
        {[
          { label: "Free", price: "$0", sub: "forever" },
          { label: "Pro", price: "$49", sub: "one-time", featured: true },
          { label: "Team", price: "$199", sub: "per year" },
        ].map((plan) => (
          <div
            key={plan.label}
            style={{
              padding: "24px 32px",
              borderRadius: 16,
              background: plan.featured
                ? "rgba(194,241,60,0.08)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${plan.featured ? "rgba(194,241,60,0.3)" : "rgba(255,255,255,0.08)"}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              minWidth: 160,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: plan.featured ? LIME : GRAY,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {plan.label}
            </span>
            <span
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.04em",
              }}
            >
              {plan.price}
            </span>
            <span style={{ fontSize: 13, color: GRAY }}>{plan.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageOG({ name, description }: { name: string; description: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BLACK,
        display: "flex",
        flexDirection: "column",
        padding: 64,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "auto",
          zIndex: 1,
        }}
      >
        <BevelLogo />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
          Bevel UI
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
        <h1
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: "white",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            margin: 0,
            marginBottom: 20,
          }}
        >
          {name}
        </h1>
        <p
          style={{
            fontSize: 20,
            color: GRAY,
            fontWeight: 300,
            margin: 0,
            maxWidth: 620,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "default";
  const name = searchParams.get("name") ?? "";
  const description = searchParams.get("description") ?? "";
  const tagline = searchParams.get("tagline") ?? "";

  let element: React.ReactElement;

  switch (type) {
    case "system":
      element = <SystemOG name={name} description={description} />;
      break;
    case "lab":
      element = <LabOG name={name} tagline={tagline} />;
      break;
    case "pricing":
      element = <PricingOG />;
      break;
    case "page":
      element = <PageOG name={name} description={description} />;
      break;
    default:
      element = <DefaultOG />;
  }

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
  });
}
