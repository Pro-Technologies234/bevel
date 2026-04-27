"use client";

import { startTransition, useEffect, useState } from "react";
import {
  IconCheck,
  IconLoader2,
  IconLockPassword,
  IconShield,
  IconUserCircle,
} from "@tabler/icons-react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DashboardHero,
  DashboardMetricCard,
  DashboardPage,
  DashboardPanel,
  DashboardSection,
} from "@/components/dashboard/dashboard-shell";
export function SettingsContent() {
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    setName(session?.user.name ?? "");
  }, [session?.user.name]);

  async function saveName() {
    setSavingProfile(true);
    await authClient.updateUser({ name });
    setSavingProfile(false);
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 1800);
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setUpdatingPassword(true);
    await authClient.changePassword({
      currentPassword: data.get("currentPassword") as string,
      newPassword: data.get("newPassword") as string,
      revokeOtherSessions: true,
    });
    form.reset();
    setUpdatingPassword(false);
    setPasswordUpdated(true);
    window.setTimeout(() => setPasswordUpdated(false), 1800);
  }

  if (isPending) return null;

  return (
    <DashboardPage className="max-w-6xl mx-auto">
      <DashboardHero
        eyebrow="Account controls"
        title="Settings"
        description="Update your account identity, keep your login secure, and review the controls attached to this customer workspace."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          label="Display name"
          value={session?.user.name ?? "Not set"}
          detail="This is the identity shown across your customer workspace."
          className="text-xl line-clamp-1"
          icon={<IconUserCircle size={18} />}
          tone="default"
        />
        <DashboardMetricCard
          label="Email"
          value={session?.user.email ?? "Unknown"}
          detail="Your billing, license ownership, and sign-in are attached to this address."
          className="text-xl line-clamp-1"
          icon={<IconShield size={18} />}
          tone="success"
        />
        <DashboardMetricCard
          label="Security"
          value="Password login"
          detail="Changing your password will revoke other active sessions."
          className="text-xl line-clamp-1"
          icon={<IconLockPassword size={18} />}
          tone="warning"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardSection
          title="Profile"
          description="Update the account information your workspace uses."
        >
          <DashboardPanel className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Display name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-11 rounded-xl bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email address
                </Label>
                <Input
                  id="email"
                  value={session?.user.email ?? ""}
                  disabled
                  className="h-11 rounded-xl bg-background/30 opacity-70"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="rounded-xl"
                disabled={savingProfile}
                onClick={() =>
                  startTransition(() => {
                    void saveName();
                  })
                }
              >
                {savingProfile ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : profileSaved ? (
                  <IconCheck size={16} />
                ) : null}
                {profileSaved ? "Saved" : "Save profile"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Changes apply to your customer dashboard immediately.
              </p>
            </div>
          </DashboardPanel>
        </DashboardSection>

        <DashboardSection
          title="Password"
          description="Rotate your password and invalidate sessions on other devices."
        >
          <DashboardPanel>
            <form onSubmit={changePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm">
                  Current password
                </Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  className="h-11 rounded-xl bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm">
                  New password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  minLength={8}
                  required
                  className="h-11 rounded-xl bg-background/50"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  className="rounded-xl"
                  disabled={updatingPassword}
                >
                  {updatingPassword ? (
                    <IconLoader2 size={16} className="animate-spin" />
                  ) : passwordUpdated ? (
                    <IconCheck size={16} />
                  ) : null}
                  {passwordUpdated ? "Password updated" : "Update password"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Minimum length: 8 characters.
                </p>
              </div>
            </form>
          </DashboardPanel>
        </DashboardSection>
      </section>

      <DashboardSection
        title="Danger zone"
        description="Irreversible account actions stay isolated here."
      >
        <DashboardPanel className="border-destructive/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.08),rgba(255,255,255,0.02))]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-destructive">
                Delete account
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Permanently removing this account would delete access history,
                billing ownership links, and saved customer state. This action
                is not enabled yet.
              </p>
            </div>
            <Button variant="destructive" disabled className="rounded-xl">
              Delete account
            </Button>
          </div>
        </DashboardPanel>
      </DashboardSection>
    </DashboardPage>
  );
}
