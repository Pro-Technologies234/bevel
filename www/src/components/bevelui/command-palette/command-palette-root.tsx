"use client";

import React from "react";
import { CommandPaletteProvider } from "./command-palette-context";
import { CommandPalette, type CommandPaletteProps } from "./command-palette";
import type {
  CommandPaletteItem,
  CommandPaletteSection,
} from "./command-palette-types";

interface CommandPaletteRootProps extends Omit<CommandPaletteProps, "asDialog"> {
  sections: CommandPaletteSection[];
  defaultOpen?: boolean;
  asDialog?: boolean;
  onSelect?: (item: CommandPaletteItem) => void;
  onClose?: () => void;
}

/**
 * CommandPaletteRoot — single import that handles everything.
 *
 * @example
 * <CommandPaletteRoot
 *   sections={sections}
 *   sourceTabs={sourceTabs}
 *   filterTabs={filterTabs}
 * >
 *   <MyApp />
 * </CommandPaletteRoot>
 */
export function CommandPaletteRoot({
  children,
  sections,
  defaultOpen = false,
  asDialog = true,
  onSelect,
  onClose,
  ...paletteProps
}: CommandPaletteRootProps & { children?: React.ReactNode }) {
  return (
    <CommandPaletteProvider
      sections={sections}
      defaultOpen={defaultOpen}
      onSelect={onSelect}
      onClose={onClose}
    >
      {children}
      <CommandPalette asDialog={asDialog} {...paletteProps} />
    </CommandPaletteProvider>
  );
}
