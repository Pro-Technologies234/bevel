"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  IconBoltFilled,
  IconLayoutSidebarLeftExpand,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { DocsSidebar } from "@/components/docs/shared/docs-sidebar";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { Wrapper } from "@/components/shared/wrapper";
import { DocsCommandSearch } from "@/components/bevelui/docs/docs-command-search";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const NAVBAR_HEIGHT = "0rem"; // 56px — matches py-3 + content height

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* ── Sticky navbar ── */}
      {/* <div
        className="sticky top-0 z-50"
        style={{ "--navbar-height": NAVBAR_HEIGHT } as React.CSSProperties}
      >
        <Navbar isFixed={false} />
      </div> */}

      <div className="flex-1 flex min-h-0 bg-card/30 ">
        <div className="flex-1 flex min-w-0">
          {/* ── Desktop sidebar ── */}
          <aside
            className="hidden md:flex sticky shrink-0 overflow-y-auto"
            style={{
              top: NAVBAR_HEIGHT,
              height: `calc(100vh - ${NAVBAR_HEIGHT})`,
              width: "18rem", // 224px
            }}
          >
            <DocsSidebar />
          </aside>

          {/* ── Mobile sidebar overlay ── */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileSidebarOpen(false)}
                />

                {/* Sidebar drawer */}
                <motion.aside
                  className="fixed left-0 z-50 bg-background border-r border-border shadow-xl md:hidden overflow-y-auto"
                  style={{
                    top: NAVBAR_HEIGHT,
                    height: `calc(100vh - ${NAVBAR_HEIGHT})`,
                    width: "18rem",
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <DocsSidebar />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ── Main content ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile sidebar toggle button */}
            <div className="md:hidden flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60 sticky top-0 z-30 bg-background/80 backdrop-blur-sm">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="size-6 flex items-center justify-center bg-primary bevel rounded-full shrink-0">
                  <IconBoltFilled color="black" size={14} />
                </div>
                <span className="font-medium text-lg tracking-tight font-sans">
                  Bevel UI
                </span>
              </Link>
              <div className="flex items-center gap-2">
                {!mobileSidebarOpen && (
                  <DocsCommandSearch
                    hideAddon={isMobile}
                    className="lg:w-auto w-fit"
                  />
                )}
                <button
                  onClick={() => setMobileSidebarOpen((p) => !p)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Open navigation"
                >
                  <IconLayoutSidebarLeftExpand />
                </button>
              </div>
            </div>

            {/* Page content */}
            <main className="flex-1 min-w-0">{children}</main>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
