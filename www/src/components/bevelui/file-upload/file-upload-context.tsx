import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type React from "react";
import type {
  FileEntry,
  FileUploadConfig,
  FileUploadContextValue,
} from "./types";
import { formatBytes, getFileExt } from "./file-upload-utils";
import { FileRejection } from "react-dropzone";

const FileUploadContext = createContext<FileUploadContextValue | undefined>(
  undefined,
);

export type FileUploadProviderProps = {
  children?: React.ReactNode;
  config?: FileUploadConfig;
  /**
   * The actual upload function — provided by the consumer.
   * Must return { url, meta } on success.
   * Throw an error to trigger the error state.
   *
   * @example
   * onUpload={async (file, onProgress) => {
   *   const formData = new FormData();
   *   formData.append("file", file);
   *   const res = await fetch("/api/upload", { method: "POST", body: formData });
   *   const { url } = await res.json();
   *   return { url };
   * }}
   */
  onUpload: (
    file: File,
    onProgress: (pct: number) => void,
  ) => Promise<{ url: string; meta?: Record<string, unknown> }>;
  onComplete?: (files: FileEntry[]) => void;
  onError?: (id: string, error: string) => void;
  onFilesChange?: (files: FileEntry[]) => void;
};

export function useFileUpload(): FileUploadContextValue {
  const ctx = useContext(FileUploadContext);
  if (!ctx) {
    throw new Error("useFileUpload must be used within <FileUploadProvider>");
  }
  return ctx;
}

export function FileUploadProvider({
  children,
  config = { multiple: true, maxSize: 2 * 1024 * 1024 },
  onUpload,
  onComplete,
  onError,
  onFilesChange,
}: FileUploadProviderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>(config?.initialFiles ?? []);
  const isFull = config.maxFiles ? files.length >= config.maxFiles : false;

  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const addFiles = useCallback(
    (incoming: File[]) => {
      setFiles((prev) => {
        const remainingSlots = config.maxFiles
          ? config.maxFiles - prev.length
          : incoming.length;
        if (remainingSlots <= 0) return prev;

        const allowedFiles = incoming.slice(0, remainingSlots);
        const entries: FileEntry[] = allowedFiles.map((file) => ({
          id: crypto.randomUUID(),
          file,
          status: "idle",
          progress: 0,
          meta: {
            ext: getFileExt(file),
            size: formatBytes(file.size),
          },
        }));
        return [...prev, ...entries];
      });
    },
    [config.maxFiles],
  );

  const removeFile = useCallback((id: string) => {
    abortControllers.current.get(id)?.abort();
    abortControllers.current.delete(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const uploadFile = useCallback(
    async (id: string) => {
      setFiles((prev) => {
        const exists = prev.find((f) => f.id === id);
        if (!exists) return prev;
        return prev.map((f) =>
          f.id === id ? { ...f, status: "uploading", progress: 0 } : f,
        );
      });

      let fileEntry = files.find((f) => f.id === id);
      if (!fileEntry) return;
      const targetFile = fileEntry.file;

      setIsUploading(true);

      const onProgress = (pct: number) => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id !== id) return f;
            if (Math.abs(f.progress - pct) < 2) return f;
            return { ...f, progress: pct };
          }),
        );
      };

      try {
        const result = await onUpload(targetFile, onProgress);
        let allDone = false;
        setFiles((prev) => {
          const updated = prev.map((f) =>
            f.id === id
              ? { ...f, status: "done" as const, progress: 100, ...result }
              : f,
          );
          allDone = updated.every((f) => f.status === "done");
          if (allDone) {
            queueMicrotask(() => onComplete?.(files));
          }
          return updated;
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : `Failed to upload ${targetFile.name}`;

        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, status: "error" as const, error: message }
              : f,
          ),
        );
        onError?.(id, message);
      } finally {
        abortControllers.current.delete(id);
        setFiles((prev) => {
          const stillUploading = prev.some((f) => f.status === "uploading");
          if (!stillUploading) setIsUploading(false);
          return prev;
        });
      }
    },
    [files, onUpload, onComplete, onError],
  );

  const uploadAll = useCallback(async () => {
    const idleIds = files.filter((f) => f.status === "idle").map((f) => f.id);
    Promise.all(idleIds.map((id) => uploadFile(id)));
  }, [files, uploadFile]);

  const removeAll = useCallback(() => {
    const idsToRemove = files.map((f) => f.id).reverse();

    idsToRemove.forEach((id, index) => {
      setTimeout(() => {
        removeFile(id);
      }, index * 150);
    });
  }, [files, removeFile]);

  const cancelFile = useCallback((id: string) => {
    abortControllers.current.get(id)?.abort();
    abortControllers.current.delete(id);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id && f.status === "uploading"
          ? { ...f, status: "idle", progress: 0 }
          : f,
      ),
    );
  }, []);

  useEffect(() => {
    if (config.auto) {
      const idleFiles = files.filter((f) => f.status === "idle");
      if (idleFiles.length > 0) {
        idleFiles.forEach((f) => uploadFile(f.id));
      }
    }
  }, [files, config.auto, uploadFile]);

  const retryFile = useCallback(
    async (id: string) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id && f.status === "error"
            ? { ...f, status: "idle", progress: 0, error: undefined }
            : f,
        ),
      );
      await uploadFile(id);
    },
    [uploadFile],
  );

  const onAddRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      fileRejections.forEach(({ file, errors }) => {
        const message = errors.map((e) => e.message).join(", ");
        const fakeEntry: FileEntry = {
          id: crypto.randomUUID(),
          file,
          status: "error",
          progress: 0,
          error: message,
          meta: {
            ext: getFileExt(file),
            size: formatBytes(file.size),
          },
        };
        onError?.(fakeEntry.id, message);
      });
    },
    [onError],
  );

  useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  return (
    <FileUploadContext.Provider
      value={{
        removeAll,
        isDragging,
        files,
        isUploading,
        isFull,
        config,
        setIsDragging,
        addFiles,
        removeFile,
        uploadFile,
        uploadAll,
        cancelFile,
        retryFile,
        onAddRejected,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
}
