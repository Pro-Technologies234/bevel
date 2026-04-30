import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "./command-palette-context";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Slot } from "@radix-ui/react-slot";

interface CommandPaletteTriggerProps {
  className?: string;
  label?: string;
  hideAddon?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
}

export function CommandPaletteTrigger({
  className,
  label = "Search...",
  hideAddon = false,
  asChild = false,
  children,
}: CommandPaletteTriggerProps) {
  const { open } = useCommandPalette();

  const triggerProps = {
    onClick: open,
    className: cn(
      "flex items-center gap-2 h-8 px-3 rounded-lg text-xs cursor-pointer",
      hideAddon && "w-8!",
      className,
    ),
  };

  if (asChild) {
    return <Slot {...triggerProps}>{children}</Slot>;
  }

  return (
    <Button variant="outline" {...triggerProps}>
      <IconSearch size={14} strokeWidth={1.8} />
      {!hideAddon && (
        <>
          <span className="flex-1 text-left">{label}</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </>
      )}
    </Button>
  );
}
