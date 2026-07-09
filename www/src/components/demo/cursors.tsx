"use client";

import * as React from "react";
import {
  CursorsRoot,
  CursorCanvas,
  useCursors,
} from "@/components/bevelui/cursors";

// ─── Simulated users ──────────────────────────────────────────────────────────

const SIMULATED_USERS = [
  { userId: "sim-1", userName: "Alice" },
  { userId: "sim-2", userName: "Bob" },
  { userId: "sim-3", userName: "Charlie" },
  { userId: "sim-4", userName: "Diana" },
];

// Random-walk simulation — wired to updateCursor exactly as real transport would be
function SimulatedCursors() {
  const { updateCursor } = useCursors();

  React.useEffect(() => {
    // Per-user velocity state
    const state = Object.fromEntries(
      SIMULATED_USERS.map((u) => [
        u.userId,
        {
          x:  0.1 + Math.random() * 0.8,
          y:  0.1 + Math.random() * 0.8,
          vx: (Math.random() - 0.5) * 0.01,
          vy: (Math.random() - 0.5) * 0.01,
        },
      ]),
    );

    const tick = setInterval(() => {
      SIMULATED_USERS.forEach((user) => {
        const s = state[user.userId];
        // Accelerate randomly, damp, bounce off walls
        s.vx += (Math.random() - 0.5) * 0.008;
        s.vy += (Math.random() - 0.5) * 0.008;
        s.vx  = Math.max(-0.025, Math.min(0.025, s.vx)) * 0.92;
        s.vy  = Math.max(-0.025, Math.min(0.025, s.vy)) * 0.92;
        s.x   = Math.max(0.04, Math.min(0.96, s.x + s.vx));
        s.y   = Math.max(0.04, Math.min(0.96, s.y + s.vy));
        // Bounce
        if (s.x <= 0.04 || s.x >= 0.96) s.vx *= -1;
        if (s.y <= 0.04 || s.y >= 0.96) s.vy *= -1;

        updateCursor({
          userId:   user.userId,
          userName: user.userName,
          position: { x: s.x, y: s.y },
        });
      });
    }, 80);

    return () => clearInterval(tick);
  }, [updateCursor]);

  return null;
}

// ─── Main demo ────────────────────────────────────────────────────────────────

export function CursorsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <CursorsRoot
        localUser={{ userId: "local-user", userName: "You" }}
        config={{ showSelf: false, idleAfter: 5, removeAfter: 15, throttleMs: 40 }}
        onMove={(_pos) => {
          // In production: socket.emit("cursor", { userId, position: pos })
        }}
      >
        <CursorCanvas className="h-80 rounded-xl border border-border bg-card/40 overflow-hidden">
          <SimulatedCursors />
          {/* Decorative grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
            aria-hidden
          >
            <defs>
              <pattern id="cg" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cg)" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <p className="text-[13px] font-mono text-muted-foreground/30">
              Move your cursor here
            </p>
          </div>
        </CursorCanvas>
      </CursorsRoot>

      <p className="text-[11px] text-muted-foreground/40 font-mono">
        4 simulated users · label overlaps resolved each frame · idle fade after 5s
      </p>
    </div>
  );
}

// ─── Transport wiring demo ─────────────────────────────────────────────────────
// Shows the canonical pattern for wiring a real transport.

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
//    (updateCursor / removeCursor are stable refs — safe in effect deps)
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
