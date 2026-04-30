import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "./command-palette-context";
import { CommandPaletteSearchbar } from "./command-palette-searchbar";
import {
  CommandPaletteSourceTabs,
  CommandPaletteFilterTabs,
} from "./command-palette-tabs";
import { CommandPaletteResults } from "./command-palette-results";
import { CommandPaletteFooter } from "./command-palette-footer";
import type {
  CommandPaletteSourceTab,
  CommandPaletteFilterTab,
} from "./command-palette-types";

interface CommandPaletteShellProps {
  sourceTabs?: CommandPaletteSourceTab[];
  filterTabs?: CommandPaletteFilterTab[];
  className?: string;
  onSettings?: () => void;
  onAddSource?: () => void;
}

function CommandPaletteShell({
  sourceTabs,
  filterTabs,
  className,
  onSettings,
  onAddSource,
}: CommandPaletteShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-popover rounded-xl border border-border shadow-2xl overflow-hidden",
        "sm:min-w-[520px] max-w-[620px] w-full",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <CommandPaletteSearchbar />

      {sourceTabs && sourceTabs.length > 0 && (
        <CommandPaletteSourceTabs tabs={sourceTabs} onAddSource={onAddSource} />
      )}

      {filterTabs && filterTabs.length > 0 && (
        <CommandPaletteFilterTabs tabs={filterTabs} />
      )}

      <CommandPaletteResults />

      <CommandPaletteFooter onSettings={onSettings} />
    </div>
  );
}

interface CommandPaletteDialogProps extends CommandPaletteShellProps {}

function CommandPaletteDialog(props: CommandPaletteDialogProps) {
  const { isOpen, close } = useCommandPalette();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="palette-backdrop"
            className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
          />

          {/* Palette */}
          <motion.div
            key="palette-card"
            className="fixed inset-0 z-[301] flex items-start justify-center pt-[15vh] px-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-auto w-full max-w-[580px]">
              <CommandPaletteShell {...props} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export interface CommandPaletteProps extends CommandPaletteShellProps {
  /**
   * true  → renders as a floating dialog (default, recommended)
   * false → renders inline in the DOM
   */
  asDialog?: boolean;
}

export function CommandPalette({
  asDialog = true,
  ...props
}: CommandPaletteProps) {
  if (!asDialog) {
    return <CommandPaletteShell {...props} />;
  }
  return <CommandPaletteDialog {...props} />;
}
