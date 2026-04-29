"use client";

import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconBoltFilled,
  IconExternalLink,
  IconMaximize,
  IconCloud,
  IconUsers,
  IconRocket,
  IconBriefcase,
  IconPackage,
  IconSettings,
  IconArrowRight,
  IconFlask,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Intro } from "./intro";
import { LabsMain } from "./main";

// ─── Labs page ────────────────────────────────────────────────────────────────

export function LabsContent() {
  return (
    <div>
      <Intro />
      {/* Main — sidebar + preview */}
      <LabsMain />
      {/* Bottom CTA */}
      <div className="border-t border-border mt-6">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3 font-sans">
            Ready to use these in your product?
          </h2>
          <p className="text-muted-foreground text-base mb-8 font-light">
            Install any system in seconds. Start with the free ones.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button className=" gap-2 rounded-full px-4" asChild>
              <Link href="/docs/components" className="flex items-center gap-2">
                Browse all systems <IconArrowRight size={14} />
              </Link>
            </Button>
            {/* <Button variant="outline" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
