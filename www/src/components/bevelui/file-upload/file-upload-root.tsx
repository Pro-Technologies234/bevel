import React from "react";
import {
  FileUploadProvider,
  type FileUploadProviderProps,
} from "./file-upload-context";
import { FileUploadDropzone } from "./file-upload-dropzone";
import { FileUploadList } from "./file-upload-list";

interface FileUploadRootProps extends FileUploadProviderProps {
  /** Render custom children instead of the default dropzone + list layout */
  children?: React.ReactNode;
}

/**
 * FileUploadRoot — single import that composes the full system.
 *
 * Uses default layout (dropzone + list) unless you pass children.
 *
 * @example — default layout
 * <FileUploadRoot
 *   config={{ maxSize: 5 * 1024 * 1024, accept: { "image/*": [] } }}
 *   onUpload={async (file, onProgress) => {
 *     const url = await uploadToS3(file, onProgress);
 *     return { url };
 *   }}
 * />
 *
 * @example — custom layout
 * <FileUploadRoot onUpload={...}>
 *   <MyCustomDropzone />
 *   <MyCustomList />
 * </FileUploadRoot>
 */
export function FileUploadRoot({
  children,
  ...providerProps
}: FileUploadRootProps) {
  return (
    <FileUploadProvider {...providerProps}>
      <div className="flex flex-col gap-4 w-full">
        {children ?? (
          <>
            <FileUploadDropzone />
            <FileUploadList />
          </>
        )}
      </div>
    </FileUploadProvider>
  );
}
