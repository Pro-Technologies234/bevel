"use client";

import {
  IconLayoutDashboard,
  IconPackage,
  IconReceipt,
  IconSettings,
  IconBoltFilled,
  IconHelp,
  IconBook2,
  IconSparkles,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/shared/app-sidebar/nav-main";
import { NavSecondary } from "@/components/shared/app-sidebar/nav-secondary";
import { NavUser } from "@/components/shared/app-sidebar/nav-user";

const navMainItems = [
  { title: "Overview", url: "/dashboard", icon: IconLayoutDashboard },
  { title: "My Systems", url: "/dashboard/components", icon: IconPackage },
  { title: "Billing", url: "/dashboard/billing", icon: IconReceipt },
  { title: "Invoices", url: "/dashboard/invoices", icon: IconReceipt },
  { title: "Settings", url: "/dashboard/settings", icon: IconSettings },
];

const navSecondaryItems = [
  { title: "Documentation", url: "/docs/introduction", icon: IconBook2 },
  { title: "Pricing", url: "/pricing", icon: IconSparkles },
  { title: "Get Help", url: "/docs/components", icon: IconHelp },
];

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader className="gap-3 p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto rounded-xl data-[slot=sidebar-menu-button]:p-3!"
            >
              <a href="/" className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-2xl bg-primary text-black">
                  <IconBoltFilled className="size-5!" />
                </div>
                <span className="text-base font-semibold tracking-tight">
                  Bevel UI
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
