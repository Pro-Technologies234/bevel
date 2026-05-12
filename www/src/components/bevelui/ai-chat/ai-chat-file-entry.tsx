import {
  IconX,
  IconFile,
  IconPhoto,
  IconFileTypePdf,
  IconFileCode,
  IconFileText,
} from "@tabler/icons-react";
import { AIChatAction } from "./ai-chat-action";

export function AIChatFileEntry({
  id,
  file,
  onRemove,
}: {
  id: number;
  file: File;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/60 border border-border text-[11px] animate-in fade-in zoom-in-95 duration-200">
      {/* Render the icon based on file type */}
      <span className="text-muted-foreground">{renderFileType(file)}</span>

      <span className="truncate max-w-[120px] font-medium">{file.name}</span>

      <AIChatAction
        type="button"
        size={"icon-xs"}
        variant={"ghost"}
        onClick={() => onRemove(id)}
        className="h-4.5 w-4.5 hover:text-destructive cursor-pointer rounded-sm ml-0.5"
      >
        <IconX size={14} />
      </AIChatAction>
    </div>
  );
}

export function renderFileType(file: File) {
  const type = file.type;

  // Handle Images
  if (type.startsWith("image/")) {
    return <IconPhoto size={14} />;
  }

  // Handle PDFs
  if (type === "application/pdf") {
    return <IconFileTypePdf size={14} />;
  }

  // Handle Code/Data files
  if (
    type.startsWith("text/") ||
    type.includes("javascript") ||
    type.includes("json") ||
    file.name.endsWith(".py") ||
    file.name.endsWith(".ts")
  ) {
    return <IconFileCode size={14} />;
  }

  // Handle Documents
  if (type.includes("word") || type.includes("officedocument")) {
    return <IconFileText size={14} />;
  }

  // Default fallback
  return <IconFile size={14} />;
}

// export function AIChatFilePreview({ file }: { file: File }) {
//   return renderFileType(file);
// }
