"use client";

import * as React from "react";
import { PaletteCtx } from "./palette-context";
import { PaletteGrid } from "./palette-grid";
import { PaletteToolbar } from "./palette-toolbar";
import { PaletteColorEditor } from "./palette-color-editor";
import { normalizeHex } from "./palette-utils";
import type {
  PaletteColor,
  PaletteConfig,
  PaletteContextValue,
} from "./palette-types";
import { cn } from "@/lib/utils";

let _id = 0;
function uid() {
  return `pc_${++_id}`;
}

export interface PaletteRootProps {
  /** Initial colors. Each must have id + hex. */
  defaultColors?: PaletteColor[];
  /** Controlled colors — pair with onChange */
  colors?: PaletteColor[];
  onChange?: (colors: PaletteColor[]) => void;
  config?: PaletteConfig;
  /** Replace the default layout entirely */
  children?: React.ReactNode;
  className?: string;
}

export function PaletteRoot({
  defaultColors = [],
  colors: controlled,
  onChange,
  config = {},
  children,
  className,
}: PaletteRootProps) {
  const [internal, setInternal] = React.useState<PaletteColor[]>(
    controlled ?? defaultColors,
  );
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const colors = controlled ?? internal;

  function commit(next: PaletteColor[]) {
    if (!controlled) setInternal(next);
    onChange?.(next);
  }

  const ctx: PaletteContextValue = {
    colors,
    selectedId,
    editingId,
    config,

    select: (id) => setSelectedId(id),
    startEdit: (id) => {
      setSelectedId(id);
      setEditingId(id);
    },
    stopEdit: () => setEditingId(null),

    add: (hex = "#c2f13c") => {
      if (config.maxColors && colors.length >= config.maxColors) return;
      const color: PaletteColor = { id: uid(), hex: normalizeHex(hex) ?? hex };
      const next = [...colors, color];
      commit(next);
      setSelectedId(color.id);
      setEditingId(color.id);
    },

    remove: (id) => {
      commit(colors.filter((c) => c.id !== id));
      if (selectedId === id) setSelectedId(null);
      if (editingId === id) setEditingId(null);
    },

    update: (id, patch) => {
      commit(colors.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },

    reorder: (next) => commit(next),
    duplicate: (id) => {
      const src = colors.find((c) => c.id === id);
      if (!src) return;
      const copy: PaletteColor = {
        id: uid(),
        hex: src.hex,
        name: src.name ? `${src.name} copy` : undefined,
      };
      const idx = colors.findIndex((c) => c.id === id);
      const next = [...colors];
      next.splice(idx + 1, 0, copy);
      commit(next);
      setSelectedId(copy.id);
    },
  };

  return (
    <PaletteCtx.Provider value={ctx}>
      {children ?? (
        <div className={cn("flex flex-col gap-3", className)}>
          <PaletteToolbar />
          <div className="flex gap-4 items-start">
            <PaletteGrid />
            <PaletteColorEditor />
          </div>
        </div>
      )}
    </PaletteCtx.Provider>
  );
}

PaletteRoot.displayName = "PaletteRoot";
