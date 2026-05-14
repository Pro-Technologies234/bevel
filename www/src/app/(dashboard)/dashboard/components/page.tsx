import Link from "next/link";
import { headers } from "next/headers";
import {
  IconBoltFilled,
  IconCheck,
  IconExternalLink,
  IconLock,
  IconSparkles,
  IconTerminal2,
} from "@tabler/icons-react";
import { auth } from "@/lib/auth";
import { getUserAccessList } from "@/lib/access";
import { getUserLicenses } from "@/actions/subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DashboardHero,
  DashboardMetricCard,
  DashboardPage,
  DashboardPanel,
  DashboardSection,
} from "@/components/dashboard/dashboard-shell";
import { DashboardCopyButton } from "@/components/dashboard/dashboard-copy-button";
import { dashboardComponentsMetadata } from "@/lib/metadata";
export const metadata = dashboardComponentsMetadata;

export default async function MySystemsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const accessList = await getUserAccessList(session!.user.id);
  const licenses = await getUserLicenses();

  const primaryLicense = licenses[0];
  const accessibleCount = accessList.filter((item) => item.hasAccess).length;
  const proCount = accessList.filter(
    (item) => item.hasAccess && item.product.tier !== "FREE",
  ).length;

  return (
    <DashboardPage>
      <DashboardHero
        eyebrow="Install-ready catalog"
        title="Your systems"
        description="Everything connected to your account lives here, including install commands, docs, and the license key used for paid systems."
      >
        <Badge variant="outline" className="border-white/10 bg-background/70">
          {accessibleCount} available now
        </Badge>
        <Badge variant="outline" className="border-white/10 bg-background/70">
          {proCount} paid systems
        </Badge>
      </DashboardHero>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          label="Accessible systems"
          value={`${accessibleCount}`}
          detail="Every item below is tied directly to your account entitlement."
          icon={<IconCheck size={18} />}
          tone="success"
        />
        <DashboardMetricCard
          label="Paid unlocks"
          value={`${proCount}`}
          detail="Use your license key when installing Pro registry entries."
          icon={<IconSparkles size={18} />}
          tone="warning"
        />
        <DashboardMetricCard
          label="License status"
          value={primaryLicense ? "Active" : "Not issued"}
          detail={
            primaryLicense
              ? "Your primary key is ready to copy into the CLI."
              : "A license key appears here after your first paid purchase."
          }
          icon={<IconBoltFilled size={18} />}
          tone="default"
        />
      </section>

      {primaryLicense ? (
        <DashboardSection
          title="Primary license key"
          description="Use this when installing protected registry endpoints from the CLI."
        >
          <DashboardPanel className="space-y-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <code className="flex-1 overflow-x-auto rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 font-mono text-sm text-primary">
                {primaryLicense.key}
              </code>
              <DashboardCopyButton value={primaryLicense.key} />
            </div>
            <div className="rounded-lg border border-white/10 bg-background/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <IconTerminal2 size={16} className="text-primary" />
                CLI example
              </div>
              <code className="block overflow-x-auto text-xs leading-6 text-muted-foreground">
                {`npx shadcn@latest add https://bevelui.vercel.app/api/r/pro/[system].json --auth ${primaryLicense.key}`}
              </code>
            </div>
          </DashboardPanel>
        </DashboardSection>
      ) : null}

      <DashboardSection
        title="Catalog access"
        description="Each card shows whether the system is ready to install, where the entitlement came from, and where to go next."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {accessList.map(({ product, hasAccess, source }) => {
            const installCommand =
              hasAccess && product.registryPath
                ? product.tier === "FREE"
                  ? `bunx --bun shadcn@latest add https://bevelui.vercel.app/${product.registryPath}`
                  : `bunx --bun shadcn@latest add https://bevelui.vercel.app/api/${product.registryPath}`
                : null;

            return (
              <DashboardPanel
                key={product.id}
                className={`space-y-4 ${hasAccess ? "" : "opacity-75"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-white/10 bg-background/60"
                      >
                        {product.tier}
                      </Badge>
                      {source ? (
                        <Badge variant="outline" className="border-white/10">
                          via {source}
                        </Badge>
                      ) : null}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${
                      hasAccess
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {hasAccess ? (
                      <IconCheck size={18} />
                    ) : (
                      <IconLock size={18} />
                    )}
                  </div>
                </div>

                {installCommand ? (
                  <div className="rounded-lg border border-white/10 bg-background/40 px-4 py-2">
                    <code className="block overflow-x-auto text-xs leading-6 text-muted-foreground">
                      {installCommand}
                    </code>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-white/10 bg-background/25 p-4 text-sm text-muted-foreground">
                    Upgrade this workspace to unlock the registry endpoint and
                    docs access.
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {hasAccess && product.docsPath ? (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full px-4 font-sans"
                    >
                      <Link href={`/${product.docsPath}`} target="_blank">
                        <IconExternalLink />
                        Open docs
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="rounded-full px-4 font-sans">
                      <Link href="/pricing">Upgrade to access</Link>
                    </Button>
                  )}
                </div>
              </DashboardPanel>
            );
          })}
        </div>
      </DashboardSection>
    </DashboardPage>
  );
}
