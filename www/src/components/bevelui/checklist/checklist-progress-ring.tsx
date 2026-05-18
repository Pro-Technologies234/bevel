import * as React from "react";

export function ChecklistProgressRing({
  progress,
  size = 44,
  strokeWidth = 3,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const r   = (size - strokeWidth * 2) / 2;
  const c   = 2 * Math.PI * r;
  const off = c - (progress / 100) * c;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        className="text-muted/40"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeDasharray={c}
        strokeDashoffset={off}
        className="text-primary transition-all duration-500"
        strokeLinecap="round"
      />
    </svg>
  );
}