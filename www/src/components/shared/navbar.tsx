"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconBoltFilled,
  IconMenu2,
  IconX,
  IconBrandGithub,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Wrapper } from "@/components/shared/wrapper";
import { DocsCommandSearch } from "@/components/bevelui/docs/docs-command-search";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSectionValue } from "@/hooks/use-section-value";
import Marquee from "../base/home/Marquee";
import Image from "next/image";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";

const navigations = [
  { id: "intro", label: "Intro", href: "/" },
  { id: "docs", label: "Documentation", href: "/docs/introduction" },
  { id: "systems", label: "Systems", href: "/docs/components" },
  // { id: "pricing", label: "Pricing", href: "/pricing" },
  // { id: "labs", label: "Labs", href: "/labs" },
];

export function Navbar({ isFixed = true }: { isFixed?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "w-full z-50 border-b border-border/60",
          "bg-background/80 backdrop-blur-sm",
          isFixed && "fixed top-0",
        )}
        data-lenis-prevent
      >
        {pathname === "/" && <Marquee />}
        <Wrapper className="flex flex-row items-center justify-between py-3">
          {/* Left — logo + nav */}
          <nav className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-end gap-2 shrink-0">
              <BrandMark />
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-1">
              {navigations.slice(1).map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-[13px] font-medium transition-colors px-3 py-1.5 rounded-full hover:bg-muted/60",
                        isActive ? "text-foreground bg-muted/40" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right — search + CTA + mobile toggle */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search — hidden on mobile, visible md+ */}
            <div className="hidden md:block">
              <DocsCommandSearch />
            </div>

            {/* CTA — hidden on mobile */}
            <div className="hidden md:flex items-center gap-1.5">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground">
                  <IconBrandGithub size={18} />
                </Button>
              </a>
              <ThemeToggle />
              <Link href="/docs/introduction">
                <Button
                  size="sm"
                  className="rounded-full px-4 gap-1.5 font-semibold shadow-sm ml-1"
                >
                  <IconBoltFilled size={14} />
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <Button
              onClick={() => setMobileOpen(true)}
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="md:hidden text-foreground"
            >
              <IconMenu2 size={20} />
            </Button>
          </div>
        </Wrapper>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0  bg-lime-950/30 md:hidden z-10 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            >
              <div className=" absolute inset-0 bg-background/20" />
            </motion.div>

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm bg-background border-l border-border/40 shadow-2xl md:hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <BrandMark />
                <Button
                  onClick={() => setMobileOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground -mr-2"
                >
                  <IconX size={20} />
                </Button>
              </div>

              {/* Drawer search */}
              <div className="p-4 border-b border-border/40">
                <DocsCommandSearch />
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {navigations.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border/40 flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground">
                      <IconBrandGithub size={18} />
                    </Button>
                  </a>
                </div>
                <Button size="sm" className="rounded-full" asChild>
                  <Link href="/docs/introduction">Get Started</Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
