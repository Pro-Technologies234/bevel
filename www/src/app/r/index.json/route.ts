import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const rDir = path.join(process.cwd(), "public", "r");
  const items: any[] = [];

  if (fs.existsSync(rDir)) {
    const files = fs.readdirSync(rDir);
    for (const file of files) {
      if (
        file.endsWith(".json") &&
        file !== "registry.json" &&
        file !== "index.json"
      ) {
        try {
          const content = fs.readFileSync(path.join(rDir, file), "utf-8");
          const parsed = JSON.parse(content);
          items.push({
            name: parsed.name || file.replace(".json", ""),
            type: parsed.type || "registry:ui",
            title: parsed.title || parsed.name,
            description: parsed.description || "",
            dependencies: parsed.dependencies || [],
            registryDependencies: parsed.registryDependencies || [],
            files: (parsed.files || []).map((f: any) => ({
              path: f.path,
              type: f.type || "registry:page",
              target: f.target,
            })),
          });
        } catch {
          // Ignore invalid JSON files
        }
      }
    }
  }

  return NextResponse.json(items, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
