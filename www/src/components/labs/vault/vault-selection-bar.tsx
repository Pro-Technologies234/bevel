import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconDownload, IconTrash, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

interface VaultSelectionBarProps {
  selected: Set<string>;
  setSelected: (s: Set<string>) => void;
  deleteSelected: () => void;
}

export function VaultSelectionBar({
  selected,
  setSelected,
  deleteSelected,
}: VaultSelectionBarProps) {
  return (
    <AnimatePresence>
      {selected.size > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className=" fixed bottom-10 inset-x-0 flex items-center justify-center z-50"
        >
          <div className="w-fit flex items-center gap-2 p-2 bg-popover border rounded-full">
            <Button
              variant="secondary"
              size={"icon"}
              className=" rounded-full"
              onClick={() => setSelected(new Set())}
            >
              <IconX />
            </Button>
            <span className="text-xs font-medium shrink-0 ">
              {selected.size} selected
            </span>
            <Separator orientation="vertical" />
            <Button
              variant="ghost"
              size={"icon"}
              className=" rounded-full"
              //   onClick={deleteSelected}
            >
              <IconDownload />
            </Button>
            <Button
              variant="destructive"
              size={"icon"}
              className=" rounded-full"
              onClick={deleteSelected}
            >
              <IconTrash />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
