"use client";

import Dropzone from "react-dropzone";
import { useFileUpload } from "./file-upload-context";
import { IconUpload } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function FileUploadDropzone() {
  const { isDragging, setIsDragging, addFiles, config } = useFileUpload();
  const {
    accept,
    multiple,
    maxFiles,
    maxSize,
    title = "Drop your files here",
    description = "Drag and drop files here, or click to browse",
    icon,
  } = config;

  return (
    <Dropzone
      accept={accept}
      multiple={multiple}
      maxFiles={maxFiles}
      maxSize={maxSize}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDropAccepted={(f) => {
        setIsDragging(false);
        addFiles(f);
      }}
      onDropRejected={() => setIsDragging(false)}
    >
      {({ getInputProps, getRootProps }) => (
        <div
          {...getRootProps()}
          className={cn(
            "w-full rounded-2xl border-2 border-dashed cursor-pointer",
            "flex flex-col items-center justify-center gap-4 p-6",
            "bg-muted/20 hover:bg-muted/28 transition-colors duration-150",
            "text-center select-none",
            isDragging
              ? "bg-primary/8 border-primary/70"
              : "border-border/60 hover:border-border",
          )}
        >
          <input {...getInputProps()} />

          {/* Icon */}
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              "bg-primary/3 border border-primary/5",
            )}
          >
            {icon ?? <IconUpload size={32} className="stroke-primary" />}
          </div>

          {/* Hints */}
          <div>
            <span className=" font-medium text-foreground">{title}</span>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
