export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTimeLeft(progress: number): string {
  if (progress >= 100) return "Done";
  if (progress === 0) return "Starting...";
  const remaining = Math.round(((100 - progress) / progress) * 3);
  return `${remaining} sec left`;
}

export function getFileExt(file: File): string {
  return file.name.split(".").pop()?.toUpperCase() ?? "FILE";
}
