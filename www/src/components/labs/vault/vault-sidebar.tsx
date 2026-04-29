"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  IconBoltFilled,
  IconClock,
  IconClockFilled,
  IconCloud,
  IconLayoutRows,
  IconStar,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// This is sample data.
const data = {
  navMain: [
    {
      id: "all",
      icon: IconCloud,
      title: "All",
      url: "#",
    },
    {
      id: "recent",
      icon: IconClockFilled,
      title: "Recent",
      url: "#",
    },
    {
      id: "starred",
      icon: IconStar,
      title: "Starred",
      url: "#",
    },
  ],
};

export function VaultAppSidebar({
  active,
  onChange,
  storageUsed,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  active: string;
  onChange: (id: string) => void;
  storageUsed: number;
}) {
  const usedPct = Math.min(
    (storageUsed / (15 * 1024 * 1024 * 1024)) * 100,
    100,
  );
  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <Sidebar {...props} collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2  py-4 border-b border-border">
                <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
                  <IconBoltFilled size={12} color="#0a0a0a" />
                </div>
                <span className="font-semibold text-sm">Vault</span>
                <Badge
                  variant="secondary"
                  className="text-[9px] ml-auto px-1.5 py-0 bg-linear-to-tr from-yellow-400 to-yellow-200 text-black"
                >
                  Beta
                </Badge>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem
                key={item.title}
                onClick={() => onChange(item.id)}
                className={cn(
                  " rounded-full px-2 bg-card",
                  active === item.id && "bg-primary/10 text-lime-200",
                )}
              >
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    <item.icon className=" text-primary fill-primary" />
                    {item.title}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* Storage meter */}
      <SidebarFooter>
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-muted-foreground">Storage</span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {formatBytes(storageUsed)} / 15 GB
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all ease-in-out"
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
