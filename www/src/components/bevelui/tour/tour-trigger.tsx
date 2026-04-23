"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconRoute } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useTour } from "./tour-context";
import { Slot } from "@radix-ui/react-slot";

interface TourTriggerProps {
  label?: string;
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

export function TourTrigger({
  label = "Take a tour",
  className,
  asChild = false,
  children,
}: TourTriggerProps) {
  const { start, isOpen } = useTour();

  const triggerProps = {
    onClick: start,
    disabled: isOpen,
    className: cn("gap-2 cursor-pointer", className),
  };

  if (asChild) {
    return <Slot {...triggerProps}>{children}</Slot>;
  }

  return (
    <Button variant="outline" size="sm" {...triggerProps}>
      <IconRoute size={14} strokeWidth={1.8} />
      {isOpen ? "Tour running..." : label}
    </Button>
  );
}
