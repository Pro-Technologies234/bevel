import Link from "next/link";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Wrapper } from "./wrapper";
import { BrandMark } from "./brand-mark";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Systems", href: "/docs/components" },
      { label: "Pricing", href: "/pricing" },
      { label: "Compare", href: "/compare" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs/introduction" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Labs", href: "/labs" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Enterprise", href: "/enterprise" },
      { label: "Contact", href: "mailto:hello@bevelui.vercel.app" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <Wrapper>
      <footer className="w-full pt-16 pb-8 border-t border-border/60">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <BrandMark />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-56">
              Fully-engineered UI systems for React. Copy the code, own it
              forever.
            </p>
            <div className="flex items-center gap-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="secondary" className="cursor-pointer">
                  <IconBrandGithub size={18} strokeWidth={1.5} />
                </Button>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="secondary" className="cursor-pointer">
                  <IconBrandX size={18} strokeWidth={1.5} />
                </Button>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50">
                {col.title}
              </span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Bevel UI. MIT licensed.
          </span>
          <span className="text-xs text-muted-foreground/50">
            Built by{" "}
            <a
              href="https://x.com/EgaamPoyeKitoye"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Poye Kitoye
            </a>
          </span>
        </div>
      </footer>
    </Wrapper>
  );
}
