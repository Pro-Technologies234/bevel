import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader } from "../ui/card";

export function DashboardPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative px-4 pb-8 lg:px-6", className)}>
      <div className="relative flex flex-col gap-6">{children}</div>
    </div>
  );
}

export function DashboardHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10  xl:p-8 bg-card backdrop-blur-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-3">
          {eyebrow ? (
            <Badge
              variant="outline"
              className="bg-muted/60 p-3 gap-2 text-[10px] uppercase select-none text-foreground/80"
            >
              {eyebrow}
            </Badge>
          ) : null}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold  text-balance sm:text-4xl font-sans">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {children ? (
          <div className="flex flex-wrap items-center gap-3">{children}</div>
        ) : null}
      </div>
    </section>
  );
}

export function DashboardSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function DashboardPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-card/75 p-5 shadow-[0_20px_60px_-42px_rgba(0,0,0,0.8)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardMetricCard({
  label,
  value,
  detail,
  icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  tone?: "default" | "success" | "warning";
  className?: string;
}) {
  const tones = {
    default: "",
    success: "",
    warning: "",
  };

  return (
    <Card className={cn("rounded-xl  ", tones[tone])}>
      <CardHeader className="mb-4 flex items-center justify-between gap-3">
        <p className={"text-sm text-muted-foreground"}>{label}</p>
        <CardAction>{icon}</CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className={cn("text-3xl font-semibold tracking-tight", className)}>
          {value}
        </p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <DashboardPanel className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </DashboardPanel>
  );
}
