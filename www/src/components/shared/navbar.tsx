"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconBoltFilled,
  IconCircleFilled,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Wrapper } from "@/components/shared/wrapper";
import { DocsCommandSearch } from "@/components/bevelui/docs/docs-command-search";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigations = [
  { id: "home", label: "Home", href: "/" },
  { id: "components", label: "Components", href: "/docs/components" },
  { id: "templates", label: "Templates", href: "/docs/templates" },
  { id: "changelogs", label: "Changelog", href: "/docs/changelog" },
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
              <span className="font-medium text-lg tracking-tight font-sans">
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
                      "cursor-pointer text-sm font-medium rounded-full tracking-tight",
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
                className="p-4 rounded-full font-semibold tracking-tight cursor-pointer bevel  gap-1.5"
              >
                <IconBoltFilled size={13} />
                Get Started
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <Button
              onClick={() => setMobileOpen((p) => !p)}
              variant={mobileOpen ? "default" : "outline"}
              aria-label="Toggle navigation"
              className={cn(
                " rounded-full p-4 uppercase font-medium text-xs md:hidden",
                !mobileOpen &&
                  "border-dashed border-2 border-foreground/80! font-light",
              )}
            >
              <IconCircleFilled className=" size-2" />
              Menu
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
              className="fixed top-0 right-0 z-50 h-full w-90 bg-background  shadow-xl md:hidden flex flex-col pl-8 pr-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-end  py-4 ">
                <Button
                  onClick={() => setMobileOpen((p) => !p)}
                  variant={mobileOpen ? "default" : "outline"}
                  aria-label="Toggle navigation"
                  className={cn(
                    " rounded-full p-4 uppercase font-medium text-xs z-500!",
                    !mobileOpen &&
                      "border-dashed border-2 border-foreground/80! font-light",
                  )}
                >
                  <IconCircleFilled className=" size-2" />
                  Close
                </Button>
              </div>

              {/* Drawer search */}
              <div className=" py-3 border-b border-border/60">
                <DocsCommandSearch />
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto py-4 flex flex-col justify-center gap-4">
                {navigations.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "w-fit relative rounded-lg text-4xl uppercase font-medium tracking-tighter transition-colors text-lime-50",
                      pathname == item.href &&
                        " after:absolute after:inset-x-0 after:border-2 after:-bottom-2 after:border-foreground after:border-dashed",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Drawer CTA */}
              <div className=" py-6 border-t border-border/60 flex flex-col text-lime-50">
                <span className=" text-sm font-medium text-muted-foreground">
                  GENERAL ENQUIRIES:
                </span>
                <a
                  href="mailto:poyekitoye@gmail.com"
                  className=" text-xl font-semibold"
                >
                  POYEKITOYE@GMAIL.COM
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
