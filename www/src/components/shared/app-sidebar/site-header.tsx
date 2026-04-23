"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconArrowUpRight, IconBook2 } from "@tabler/icons-react";

const routeMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Overview",
    description: "See access, purchases, and what to unlock next.",
  },
  "/dashboard/components": {
    title: "My Systems",
    description: "Browse every system, install command, and entitlement.",
  },
  "/dashboard/billing": {
    title: "Billing",
    description: "Manage plans, seats, and Stripe account details.",
  },
  "/dashboard/invoices": {
    title: "Invoices",
    description: "Review payment history and download receipts.",
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Update account details and security preferences.",
  },
};

export function SiteHeader() {
  const pathname = usePathname();
  const meta = routeMeta[pathname] ?? routeMeta["/dashboard"];

  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-white/10 bg-background/80 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-semibold sm:text-xl font-sans">
              {meta.title}
            </h1>
          </div>
          {/* <p className="hidden text-xs text-muted-foreground sm:block">
            {meta.description}
          </p> */}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href="/docs/introduction">
              <IconBook2 />
              Docs
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-xl  bg-linear-to-tr from-yellow-400 text-black  to-yellow-200 border-none p-4"
          >
            <Link href="/pricing">
              Upgrade
              <IconArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
