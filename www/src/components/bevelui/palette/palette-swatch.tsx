import { cn } from "@/lib/utils";
import { usePalette } from "./palette-context";
import { getContrastColor } from "./palette-utils";

export interface PaletteSwatchProps {
  id: string;
  className?: string;
}

export function PaletteSwatch({ id, className }: PaletteSwatchProps) {
  const { colors, selectedId, editingId, select, startEdit } = usePalette();
  const color = colors.find((c) => c.id === id);
  if (!color) return null;

  const isSelected = selectedId === id;
  const isEditing = editingId === id;
  const textColor = getContrastColor(color.hex);

  return (
    <button
      type="button"
      title={color.name ?? color.hex}
      onClick={() => select(id)}
      onDoubleClick={() => startEdit(id)}
      className={cn(
        "w-9 h-9 rounded-sm border-2 transition-all focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        isSelected
          ? "border-primary/50 scale-110 shadow-md z-10"
          : "border-transparent hover:scale-105 hover:border-border",
        isEditing && "ring-2 ring-primary/20 ring-offset-1",
        className,
      )}
      style={{ backgroundColor: color.hex }}
      aria-pressed={isSelected}
      aria-label={color.name ?? color.hex}
    />
  );
}

PaletteSwatch.displayName = "PaletteSwatch";
