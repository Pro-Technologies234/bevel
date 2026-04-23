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
  IconSettings,
  IconBoltFilled,
  IconLogout,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/admin", icon: IconLayoutDashboard },
  { label: "Users", href: "/admin/users", icon: IconUsers },
  { label: "Products", href: "/admin/products", icon: IconPackage },
  { label: "Orders", href: "/admin/orders", icon: IconShoppingCart },
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
      <aside className="w-56 shrink-0 border-r border-border flex flex-col bg-muted/20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <IconBoltFilled size={12} color="#0a0a0a" />
          </div>
          <div>
            <span className="text-sm font-semibold leading-none">Bevel UI</span>
            <p className="text-[10px] text-muted-foreground">Admin panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 p-3 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              <item.icon size={15} strokeWidth={1.8} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg mb-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">
                {user?.name ?? "Admin"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Link
            href="/api/auth/sign-out"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors w-full"
          >
            <IconLogout size={14} strokeWidth={1.8} />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
