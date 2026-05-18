import * as React from "react";

export interface SpotlightResult {
  id:          string;
  title:       string;
  subtitle?:   string;
  description?: string;
  category:    string;
  icon?:       string | React.ElementType;
  badge?:      string;
  href?:       string;
  onSelect?:   () => void;
}

export interface SpotlightCategory {
  id:    string;
  label: string;
  icon?: React.ElementType;
}

export interface SpotlightConfig {
  categories:          SpotlightCategory[];
  placeholder?:        string;
  hotkey?:             string;
  maxRecentSearches?:  number;
  storageKey?:         string;
}

export interface SpotlightContextValue {
  isOpen:          boolean;
  query:           string;
  results:         SpotlightResult[];
  isLoading:       boolean;
  activeCategory:  string;
  recentSearches:  string[];
  open:            () => void;
  close:           () => void;
  setQuery:        (q: string) => void;
  setCategory:     (id: string) => void;
  clearHistory:    () => void;
  removeRecent:    (q: string) => void;
}