import { useGallery } from "./gallery-context";
import { GalleryItemCard } from "./gallery-item";
import { SortableRoot, SortableItem } from "../sortable";
import { cn } from "@/lib/utils";

export interface GalleryGridProps {
  className?: string;
}

export function GalleryGrid({ className }: GalleryGridProps) {
  const { items, config, reorder } = useGallery();
  const cols = config.columns ?? 4;

  const grid = (
    <div
      className={cn("grid gap-2", className)}
      style={{
        gridTemplateColumns: config.columns
          ? `repeat(${cols}, minmax(0, 1fr))`
          : "repeat(auto-fill, minmax(120px, 1fr))",
      }}
    >
      {items.map((item) =>
        config.sortable ? (
          <SortableItem key={item.id} id={item.id}>
            <GalleryItemCard item={item} className="w-full" />
          </SortableItem>
        ) : (
          <GalleryItemCard key={item.id} item={item} />
        ),
      )}
    </div>
  );

  if (!config.sortable) return grid;

  return (
    <SortableRoot
      config={{
        layout: "grid",
      }}
      items={items}
      onReorder={reorder}
    >
      {grid}
    </SortableRoot>
  );
}

GalleryGrid.displayName = "GalleryGrid";
