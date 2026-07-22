"use client";

import * as React from "react";
import {
  CursorsRoot,
  CursorCanvas,
  useCursors,
} from "@/components/bevelui/cursors";
import { cn } from "@/lib/utils";

// ─── Simulated collaborators ────────────────────────────────────────────────

const COLLABORATORS = [
  { userId: "sim-1", userName: "Alice",   color: "#a78bfa", avatar: "A" },
  { userId: "sim-2", userName: "Marcus",  color: "#34d399", avatar: "M" },
  { userId: "sim-3", userName: "Priya",   color: "#fb923c", avatar: "P" },
  { userId: "sim-4", userName: "Jordan",  color: "#60a5fa", avatar: "J" },
];

// Sticky note content for the canvas
const STICKY_NOTES = [
  { id: "n1", x: "8%",  y: "12%", bg: "#fef08a", text: "Redesign header nav", rotate: "-2deg" },
  { id: "n2", x: "38%", y: "8%",  bg: "#bbf7d0", text: "Fix mobile overflow",  rotate: "1.5deg" },
  { id: "n3", x: "66%", y: "15%", bg: "#bfdbfe", text: "Migrate to Turso DB",  rotate: "-1deg" },
  { id: "n4", x: "18%", y: "55%", bg: "#fecaca", text: "Auth token refresh",   rotate: "2deg" },
  { id: "n5", x: "55%", y: "52%", bg: "#e9d5ff", text: "Add dark mode toggle", rotate: "-1.5deg" },
];

// ─── Simulation engine ──────────────────────────────────────────────────────

function SimulatedCursors() {
  const { updateCursor } = useCursors();

  React.useEffect(() => {
    // Each cursor wanders naturally via smooth Bézier-like velocity fields
    const state: Record<string, { x: number; y: number; vx: number; vy: number; phase: number }> =
      Object.fromEntries(
        COLLABORATORS.map((u, i) => [
          u.userId,
          {
            x: 0.15 + i * 0.2,
            y: 0.2 + (i % 2) * 0.4,
            vx: (Math.random() - 0.5) * 0.008,
            vy: (Math.random() - 0.5) * 0.008,
            phase: i * 1.5,
          },
        ])
      );

    let frame = 0;
    const tick = setInterval(() => {
      frame++;
      COLLABORATORS.forEach((user) => {
        const s = state[user.userId];
        // Organic wandering: velocity nudge + sinusoidal drift
        s.vx += (Math.random() - 0.5) * 0.006 + Math.sin(frame * 0.04 + s.phase) * 0.002;
        s.vy += (Math.random() - 0.5) * 0.006 + Math.cos(frame * 0.03 + s.phase) * 0.002;
        // Damp & clamp
        s.vx = Math.max(-0.018, Math.min(0.018, s.vx)) * 0.94;
        s.vy = Math.max(-0.018, Math.min(0.018, s.vy)) * 0.94;
        s.x = Math.max(0.03, Math.min(0.97, s.x + s.vx));
        s.y = Math.max(0.03, Math.min(0.97, s.y + s.vy));
        if (s.x <= 0.03 || s.x >= 0.97) s.vx *= -1;
        if (s.y <= 0.03 || s.y >= 0.97) s.vy *= -1;

        updateCursor({
          userId: user.userId,
          userName: user.userName,
          position: { x: s.x, y: s.y },
        });
      });
    }, 60);

    return () => clearInterval(tick);
  }, [updateCursor]);

  return null;
}

// ─── Main demo ────────────────────────────────────────────────────────────────

export function CursorsDemo() {
  const [activeCount, setActiveCount] = React.useState(4);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-foreground">Shared canvas</span>
          <span className="text-[11px] text-muted-foreground/60">
            {activeCount} collaborators online
          </span>
        </div>

        {/* Presence avatars */}
        <div className="flex items-center">
          {COLLABORATORS.slice(0, activeCount).map((u, i) => (
            <div
              key={u.userId}
              title={u.userName}
              className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white shrink-0 -ml-2 first:ml-0 transition-all"
              style={{ backgroundColor: u.color, zIndex: COLLABORATORS.length - i }}
            >
              {u.avatar}
            </div>
          ))}
          <div className="ml-2 text-[10px] text-muted-foreground font-mono">+{Math.max(0, 12 - activeCount)} more</div>
        </div>
      </div>

      {/* Canvas */}
      <CursorsRoot
        localUser={{ userId: "local-user", userName: "You" }}
        config={{ showSelf: false, idleAfter: 8, removeAfter: 20, throttleMs: 30 }}
      >
        <CursorCanvas className="relative w-full h-[400px] rounded-xl border border-border bg-[#0d0d0d] overflow-hidden">
          <SimulatedCursors />

          {/* Dot-grid background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
            aria-hidden
          >
            <defs>
              <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" className="text-muted-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
          </svg>

          {/* Sticky notes */}
          {STICKY_NOTES.map((note) => (
            <div
              key={note.id}
              className="absolute w-28 p-2.5 rounded-md shadow-lg text-[11px] font-medium text-gray-800 leading-snug select-none pointer-events-none"
              style={{
                left: note.x,
                top: note.y,
                backgroundColor: note.bg,
                transform: `rotate(${note.rotate})`,
              }}
            >
              {note.text}
            </div>
          ))}

          {/* Guide label */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
              move your cursor over the canvas
            </span>
          </div>
        </CursorCanvas>
      </CursorsRoot>

      {/* Controls */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-[11px] text-muted-foreground/60 font-mono">Simulated users:</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setActiveCount(n)}
              className={cn(
                "w-6 h-6 rounded-md text-[11px] font-mono border transition-colors",
                activeCount === n
                  ? "bg-primary text-black border-primary"
                  : "bg-muted/40 text-muted-foreground border-border hover:border-muted-foreground"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Transport wiring demo ─────────────────────────────────────────────────────

export function CursorsTransportDemo() {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-4 overflow-x-auto">
      <pre className="text-[11px] font-mono text-muted-foreground/70 leading-relaxed">
        {`// 1. Wrap your shared surface with CursorsRoot + CursorCanvas
function CollabPage() {
  return (
    <CursorsRoot
      localUser={{ userId: session.userId, userName: session.name }}
      onMove={(pos) => channel.send({ type: "cursor", ...pos })}
    >
      <CursorCanvas className="h-full w-full">
        <TransportWiring />
        {/* your page content */}
      </CursorCanvas>
    </CursorsRoot>
  );
}

// 2. Wire incoming events from inside the canvas
function TransportWiring() {
  const { updateCursor, removeCursor } = useCursors();

  useEffect(() => {
    channel.on("cursor", updateCursor);
    channel.on("leave",  ({ userId }) => removeCursor(userId));
    return () => {
      channel.off("cursor", updateCursor);
      channel.off("leave",  removeCursor);
    };
  }, [updateCursor, removeCursor]);

  return null;
}`}
      </pre>
    </div>
  );
}
