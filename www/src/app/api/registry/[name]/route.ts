import { registry } from "@/registry";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  const entry = registry.find((c) => c.name === name);

  if (!entry) {
    return Response.json({ error: "Component not found" }, { status: 404 });
  }

  const files = await Promise.all(
    entry.files.map(async (file) => {
      const content = await readFile(join(process.cwd(), file.source), "utf-8");
      return {
        target: file.target,
        content,
      };
    }),
  );

  return Response.json({
    name: entry.name,
    category: entry.category,
    dependencies: entry.dependencies,
    files,
  });
}
