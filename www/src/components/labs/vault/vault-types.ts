// ─── Types ────────────────────────────────────────────────────────────────────

export type FileItem = {
  id: string;
  name: string;
  type: "folder" | "image" | "document" | "video" | "file";
  size?: number;
  modified: Date;
  starred: boolean;
  parentId: string | null;
  url?: string;
};
