import * as React from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { SortableBaseItem } from "./sortable-types";

export interface UseSortableListReturn<T extends SortableBaseItem> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  reorder: (from: string, to: string) => void;
  insert: (item: T, atIndex?: number) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Omit<T, "id">>) => void;
  move: (id: string, direction: "up" | "down") => void;
}

export function useSortableList<T extends SortableBaseItem>(
  initial: T[],
): UseSortableListReturn<T> {
  const [items, setItems] = React.useState<T[]>(initial);

  const reorder = React.useCallback((from: string, to: string) => {
    setItems((prev) => {
      const fi = prev.findIndex((i) => i.id === from);
      const ti = prev.findIndex((i) => i.id === to);
      if (fi === -1 || ti === -1) return prev;
      return arrayMove(prev, fi, ti);
    });
  }, []);

  const insert = React.useCallback((item: T, atIndex?: number) => {
    setItems((prev) => {
      const next = [...prev];
      next.splice(atIndex ?? next.length, 0, item);
      return next;
    });
  }, []);

  const remove = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const update = React.useCallback(
    (id: string, patch: Partial<Omit<T, "id">>) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      );
    },
    [],
  );

  const move = React.useCallback((id: string, direction: "up" | "down") => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const next = direction === "up" ? idx - 1 : idx + 1;
      if (next < 0 || next >= prev.length) return prev;
      return arrayMove(prev, idx, next);
    });
  }, []);

  return { items, setItems, reorder, insert, remove, update, move };
}
