"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconBoltFilled, IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Wrapper } from "@/components/shared/wrapper";
import { DocsCommandSearch } from "@/components/bevelui/docs/docs-command-search";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigations = [
  { id: "components", label: "Components", href: "/docs/components" },
  { id: "templates", label: "Templates", href: "/" },
  { id: "changelogs", label: "Changelog", href: "/" },
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
      >
        <Wrapper className="flex flex-row items-center justify-between py-3">
          {/* Left — logo + nav */}
          <nav className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="size-6 flex items-center justify-center bg-primary bevel rounded-full shrink-0">
                <IconBoltFilled color="black" size={14} />
              </div>
              <span className="font-semibold text-lg tracking-tight">
                Bevel UI
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-0.5">
              {navigations.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "cursor-pointer text-sm font-medium",
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                    asChild
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — search + CTA + mobile toggle */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search — hidden on mobile, visible md+ */}
            <div className="hidden md:block">
              <DocsCommandSearch />
            </div>

            {/* CTA — hidden on mobile */}
            <Link href="/docs/introduction" className="hidden md:block">
              <Button
                size="sm"
                className="font-semibold tracking-tight cursor-pointer bevel rounded-lg gap-1.5"
              >
                <IconBoltFilled size={13} />
                Get Started
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <IconX size={18} strokeWidth={2} />
              ) : (
                <IconMenu2 size={18} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </Wrapper>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-72 bg-background border-l border-border shadow-xl md:hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="size-5 flex items-center justify-center bg-primary bevel rounded-full">
                    <IconBoltFilled color="black" size={12} />
                  </div>
                  <span className="font-semibold text-sm">Bevel UI</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <IconX size={16} strokeWidth={2} />
                </button>
              </div>

              {/* Drawer search */}
              <div className="px-4 py-3 border-b border-border/60">
                <DocsCommandSearch />
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
                {navigations.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Drawer CTA */}
              <div className="px-4 py-4 border-t border-border/60">
                <Link href="/docs/introduction" className="block">
                  <Button className=" font-semibold tracking-tight cursor-pointer bevel rounded-md!">
                    <IconBoltFilled size={13} />
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
