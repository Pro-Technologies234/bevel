"use client";

import { type Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <div className="rounded-2xl   bg-linear-135 from-muted/80 to-background p-3">
          <span className="text-xs font-medium uppercase ">Workspace</span>
          <p className="mt-2 text-sm font-medium ">
            Manage access, billing, and delivery for every Bevel system you own.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-3 w-full justify-center rounded-xl bg-linear-to-tr from-yellow-400 text-black  to-yellow-200 border-none"
          >
            <Link href="/pricing">Unlock more systems</Link>
          </Button>
        </div>
        <SidebarGroupLabel className="px-1 text-[11px] font-sans text-sidebar-foreground/45">
          Customer Dashboard
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={
                  pathname === item.url || pathname.startsWith(`${item.url}/`)
                }
                className={cn(
                  "rounded-sm",
                  pathname === item.url && "bg-primary/10! dark:text-lime-200!",
                )}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
