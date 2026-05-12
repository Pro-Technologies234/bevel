import * as React from "react";
import { usePalette } from "./palette-context";
import { downloadColor, generateColor, hexToHsl } from "./palette-utils";
import { IconDownload, IconCopy, IconCopyCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ExportFormat } from "./palette-types";

const FORMAT_LABELS: Record<ExportFormat, string> = {
  "hex-array": "Hex array",
  "css-vars": "CSS variables",
  tailwind: "Tailwind config",
  "hsl-array": "HSL array",
};

export function PaletteExport() {
  const { colors } = usePalette();
  const [format, setFormat] = React.useState<ExportFormat>("hex-array");
  const [copied, setCopied] = React.useState(false);

  function copy() {
    const text = generateColor(format, colors);
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        {(Object.keys(FORMAT_LABELS) as ExportFormat[]).map((f) => (
          <Button
            key={f}
            onClick={() => setFormat(f)}
            variant={format === f ? "outline" : "ghost"}
            className={"justify-start"}
          >
            {FORMAT_LABELS[f]}
          </Button>
        ))}
      </div>

      <pre className=" bg-muted/40 rounded-lg p-2 overflow-x-auto max-h-32 border border-border/60">
        {generateColor(format, colors) || "No colors"}
      </pre>
      <div className="flex gap-2">
        <Button
          onClick={copy}
          variant={copied ? "outline" : "secondary"}
          className="flex-1"
        >
          {copied ? (
            <>
              <IconCopyCheck size={12} /> Copied
            </>
          ) : (
            <>
              <IconCopy size={12} /> Copy
            </>
          )}
        </Button>
        <Button
          onClick={() => downloadColor(format, colors)}
          variant={copied ? "outline" : "secondary"}
          className="flex-1"
        >
          <IconDownload size={12} /> Download
        </Button>
      </div>
    </>
  );
}

PaletteExport.displayName = "PaletteExport";
