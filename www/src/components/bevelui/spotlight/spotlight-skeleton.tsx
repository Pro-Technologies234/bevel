import * as React from "react";

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-muted/40 shrink-0 animate-pulse" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-3 bg-muted/40 rounded-full w-1/2 animate-pulse" />
        <div className="h-2.5 bg-muted/30 rounded-full w-1/3 animate-pulse" />
      </div>
    </div>
  );
}

export function SpotlightSkeleton() {
  return (
    <div className="flex flex-col py-2">
      {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
    </div>
  );
}