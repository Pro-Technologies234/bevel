// app/(admin)/admin/layout.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  IconLayoutDashboard,
  IconUsers,
  IconPackage,
  IconShoppingCart,
  IconChartBar,
  IconBoltFilled,
  IconLogout,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { adminMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata = adminMetadata;

const NAV_PRIMARY = [
  { label: "Overview", href: "/admin", icon: IconLayoutDashboard },
  { label: "Users", href: "/admin/users", icon: IconUsers },
  { label: "Products", href: "/admin/products", icon: IconPackage },
  { label: "Orders", href: "/admin/orders", icon: IconShoppingCart },
];

const NAV_SECONDARY = [
  { label: "Analytics", href: "/admin/analytics", icon: IconChartBar },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border/50 flex flex-col bg-background">
        {/* Header */}
        <div className="px-6 h-16 flex items-center justify-between border-b border-border/50">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconBoltFilled size={16} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none">
                Bevel Admin
              </div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Control panel
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Primary Navigation */}
          <div className="space-y-1 mb-6">
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </div>
            {NAV_PRIMARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                  "group relative",
                )}
              >
                <item.icon
                  size={16}
                  strokeWidth={1.8}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Secondary Navigation */}
          <div>
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Insights
            </div>
            <div className="space-y-1">
              {NAV_SECONDARY.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                    "group",
                  )}
                >
                  <item.icon
                    size={16}
                    strokeWidth={1.8}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Separator */}
        <Separator className="my-0" />

        {/* User Section */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() ??
                user?.email?.charAt(0).toUpperCase() ??
                "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">
                {user?.name ?? "Admin"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <form action="/api/auth/sign-out" method="POST">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
            >
              <IconLogout size={14} className="mr-2" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center px-8">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              Administration Panel
            </p>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
