// hooks/useSectionValue.ts
"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface SectionConfig<T> {
  id: string;
  value: T;
}

interface Options {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useSectionValue<T>(
  sections: SectionConfig<T>[],
  defaultValue: T,
  options: Options = {},
): T {
  const { rootMargin = "-10% 0px -85% 0px", threshold = 0 } = options;

  const [current, setCurrent] = useState<T>(defaultValue);
  const intersectingRef = useRef<Set<string>>(new Set());
  const sectionsRef = useRef<SectionConfig<T>[]>(sections);

  // Stable reference to sections array (only changes when content changes)
  const sectionsKey = useMemo(
    () => sections.map((s) => `${s.id}:${s.value}`).join("|"),
    [sections],
  );

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sectionsKey]); // Now only updates when actual content changes

  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolve = () => {
      const ids = Array.from(intersectingRef.current);
      if (ids.length === 0) {
        setCurrent(defaultValue);
        return;
      }

      let winnerId: string | null = null;
      let winnerTop = Infinity;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top < winnerTop) {
          winnerTop = top;
          winnerId = id;
        }
      }

      const matched = sectionsRef.current.find((s) => s.id === winnerId);
      setCurrent(matched ? matched.value : defaultValue);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          entry.isIntersecting
            ? intersectingRef.current.add(id)
            : intersectingRef.current.delete(id);
        }
        resolve();
      },
      { rootMargin, threshold },
    );

    // Observe all section elements
    const currentSections = sectionsRef.current;
    for (const { id } of currentSections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
      intersectingRef.current.clear();
    };
  }, [sectionsKey, rootMargin, defaultValue]);

  return current;
}
