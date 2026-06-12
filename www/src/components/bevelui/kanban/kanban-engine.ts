import { arrayMove } from "@dnd-kit/sortable";
import type { KanbanCardBase, KanbanColumnBase } from "./kanban-types";

export function findCard<T extends KanbanCardBase>(
  columns: KanbanColumnBase<T>[],
  cardId: string,
): T | null {
  for (const col of columns) {
    const card = col.cards.find((c) => c.id === cardId);
    if (card) return card;
  }
  return null;
}

export function findCardColumn<T extends KanbanCardBase>(
  columns: KanbanColumnBase<T>[],
  cardId: string,
): KanbanColumnBase<T> | null {
  return columns.find((col) => col.cards.some((c) => c.id === cardId)) ?? null;
}

export function findColumn<T extends KanbanCardBase>(
  columns: KanbanColumnBase<T>[],
  columnId: string,
): KanbanColumnBase<T> | null {
  return columns.find((c) => c.id === columnId) ?? null;
}

/**
 * Reorder a card within the same column.
 */
export function moveCardWithinColumn<
  T extends KanbanCardBase,
  C extends KanbanColumnBase<T>,
>(columns: C[], columnId: string, fromIndex: number, toIndex: number): C[] {
  return columns.map((col) => {
    if (col.id !== columnId) return col;
    return { ...col, cards: arrayMove(col.cards, fromIndex, toIndex) };
  });
}

/**
 * Move a card from one column to another, inserting at toIndex.
 * toIndex defaults to end of target column if not specified.
 */
export function moveCardBetweenColumns<
  T extends KanbanCardBase,
  C extends KanbanColumnBase<T>,
>(
  columns: C[],
  cardId: string,
  fromColumnId: string,
  toColumnId: string,
  toIndex?: number,
): C[] {
  const card = findCard(columns, cardId);
  if (!card) return columns;

  return columns.map((col) => {
    if (col.id === fromColumnId) {
      return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
    }
    if (col.id === toColumnId) {
      const next = [...col.cards];
      const insertAt =
        toIndex !== undefined && toIndex >= 0 ? toIndex : next.length;
      next.splice(Math.min(insertAt, next.length), 0, card);
      return { ...col, cards: next };
    }
    return col;
  });
}

/**
 * Reorder columns by index.
 */
export function reorderColumns<C extends KanbanColumnBase<KanbanCardBase>>(
  columns: C[],
  fromIndex: number,
  toIndex: number,
): C[] {
  return arrayMove(columns, fromIndex, toIndex);
}
