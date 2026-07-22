"use client";

import { toast } from "sonner";

export function FeedbackWidget() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border/60 mt-12">
      <span className="text-sm font-medium text-foreground">
        Was this page helpful?
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => toast.success("Thank you for your feedback!")}
          className="px-4 py-1.5 rounded-full border border-border bg-muted/20 text-xs font-medium hover:bg-muted/60 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => toast.success("Thank you for your feedback!")}
          className="px-4 py-1.5 rounded-full border border-border bg-muted/20 text-xs font-medium hover:bg-muted/60 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
}
