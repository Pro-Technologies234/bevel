import type React from "react";

export type CommandPaletteItem = {
  id: string;
  title: string;
  subtitle?: string;
  /** Text shown on the far right of the row (e.g. role, category label) */
  meta?: string;
  /** URL to an avatar/icon image, or a React node for an icon */
  icon?: string | React.ReactNode;
  /** Initials shown when icon is absent */
  initials?: string;
  /** Colour for the initials avatar background (any CSS colour) */
  initialsColor?: string;
  /** Filter tab id this item belongs to — used for tab filtering */
  category?: string;
  /** Source tab id this item belongs to — used for source filtering */
  source?: string;
  href?: string;
  onSelect?: (item: CommandPaletteItem) => void;
};

export type CommandPaletteSection = {
  id: string;
  title: string;
  items: CommandPaletteItem[];
};

export type CommandPaletteSourceTab = {
  id: string;
  label: string;
  /** Image URL for integration logo */
  logoSrc?: string;
  /** React icon component */
  icon?: React.ReactNode;
};

export type CommandPaletteFilterTab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

export type CommandPaletteContextValue = {
  isOpen: boolean;
  query: string;
  activeSourceTab: string;
  activeFilterTab: string;
  highlightedIndex: number;
  filteredSections: CommandPaletteSection[];
  flatResults: CommandPaletteItem[];
  isLoading: boolean;

  open: () => void;
  close: () => void;
  setQuery: (q: string) => void;
  setSourceTab: (id: string) => void;
  setFilterTab: (id: string) => void;
  moveUp: () => void;
  moveDown: () => void;
  selectHighlighted: () => void;
  selectItem: (item: CommandPaletteItem) => void;
};
