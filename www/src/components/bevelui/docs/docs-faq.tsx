"use client";

import * as React from "react";
import { useState } from "react";
import { IconChevronDown, IconHelpCircle } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

export interface FAQItem {
  q: string;
  a: string;
}

export interface DocsFAQProps {
  items: FAQItem[];
}

export function DocsFAQ({ items }: DocsFAQProps) {
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});

  if (!items || items.length === 0) return null;

  const toggle = (idx: number) => {
    setOpenIndexes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col gap-3 my-8">
      <div className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight">
        <IconHelpCircle size={18} className="text-primary" />
        <span>Frequently Asked Questions</span>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, idx) => {
          const isOpen = !!openIndexes[idx];
          return (
            <div
              key={idx}
              className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left font-medium text-xs sm:text-sm text-foreground hover:bg-muted/30 transition-colors"
              >
                <span>{item.q}</span>
                <IconChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/30">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
