"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconRoute } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useTour } from "./tour-context";

interface TourTriggerProps extends React.ComponentProps<typeof Button> {
  label?: string;
}

export function TourTrigger({
  label = "Take a tour",
  className,
  ...props
}: TourTriggerProps) {
  const { start, isOpen } = useTour();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={start}
      disabled={isOpen}
      className={cn("gap-2 cursor-pointer", className)}
      {...props}
    >
      <IconRoute size={14} strokeWidth={1.8} />
      {isOpen ? "Tour running..." : label}
    </Button>
  );
}
