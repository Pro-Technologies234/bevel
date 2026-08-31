import { NextRequest, NextResponse } from "next/server";
import { DOCS_SYSTEMS, getInstallCommand } from "@/content/docs/manifest";
import fs from "fs";
import path from "path";

const MCP_SERVER_INFO = {
  name: "bevel-ui-mcp",
  version: "1.0.0",
  description:
    "Official MCP Server for Bevel UI — Fully-engineered UI systems for React & Tailwind CSS.",
};

const MCP_TOOLS = [
  {
    name: "list_bevel_systems",
    description:
      "Lists all available Bevel UI systems with descriptions, categories, and shadcn install commands.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description:
            "Optional filter by category: navigation-search, forms-input, drag-drop, layout-panels, media-color, collaboration",
        },
      },
    },
  },
  {
    name: "get_bevel_system_docs",
    description:
      "Fetches full documentation, usage instructions, code examples, and props tables for a specific Bevel UI system.",
    inputSchema: {
      type: "object",
      properties: {
        system: {
          type: "string",
          description:
            "System route name or registry name (e.g. form-engine, product-tour, kanban, cropper, file-upload, command-palette)",
        },
      },
      required: ["system"],
    },
  },
  {
    name: "search_bevel_systems",
    description:
      "Search for Bevel UI systems matching a design requirement or feature keyword.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Search query (e.g. 'multi step form', 'drag to reorder', 'guided tour', 'color picker')",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_bevel_install_command",
    description:
      "Retrieves the exact shadcn CLI install command for a Bevel UI system.",
    inputSchema: {
      type: "object",
      properties: {
        system: {
          type: "string",
          description: "System registry name or route name",
        },
      },
      required: ["system"],
    },
  },
];

function handleToolCall(name: string, args: any) {
  const SITE_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.vercel.app";

  if (name === "list_bevel_systems") {
    let systems = DOCS_SYSTEMS;
    if (args?.category) {
      systems = systems.filter((s) => s.category === args.category);
    }
    const result = systems.map((s) => ({
      title: s.title,
      route: s.route,
      category: s.category,
      tier: s.tier,
      description: s.description,
      installCommand: getInstallCommand(s.registryName),
      docsUrl: `${SITE_URL}/docs/components/${s.route}`,
    }));
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }

  if (name === "get_bevel_install_command") {
    const query = args?.system?.toLowerCase() || "";
    const system = DOCS_SYSTEMS.find(
      (s) =>
        s.route.toLowerCase() === query ||
        s.registryName.toLowerCase() === query ||
        s.title.toLowerCase().includes(query),
    );
    if (!system) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `System '${args?.system}' not found. Available systems: ${DOCS_SYSTEMS.map((s) => s.route).join(", ")}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `Command: ${getInstallCommand(system.registryName)}\nDocs: ${SITE_URL}/docs/components/${system.route}`,
        },
      ],
    };
  }

  if (name === "search_bevel_systems") {
    const query = (args?.query || "").toLowerCase();
    const matches = DOCS_SYSTEMS.filter((s) => {
      return (
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        (s.keywords && s.keywords.some((k) => k.toLowerCase().includes(query)))
      );
    }).map((s) => ({
      title: s.title,
      route: s.route,
      description: s.description,
      installCommand: getInstallCommand(s.registryName),
      docsUrl: `${SITE_URL}/docs/components/${s.route}`,
    }));

    return {
      content: [
        {
          type: "text",
          text:
            matches.length > 0
              ? JSON.stringify(matches, null, 2)
              : `No Bevel systems found matching '${args?.query}'. Available: ${DOCS_SYSTEMS.map((s) => s.title).join(", ")}`,
        },
      ],
    };
  }

  if (name === "get_bevel_system_docs") {
    const query = (args?.system || "").toLowerCase();
    const system = DOCS_SYSTEMS.find(
      (s) =>
        s.route.toLowerCase() === query ||
        s.registryName.toLowerCase() === query ||
        s.title.toLowerCase().includes(query),
    );

    if (!system) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `System '${args?.system}' not found. Available systems: ${DOCS_SYSTEMS.map((s) => s.route).join(", ")}`,
          },
        ],
      };
    }

    const docsDir = path.join(process.cwd(), "src", "content", "docs");
    const filePath = path.join(docsDir, `${system.route}.json`);
    let docContent = `System: ${system.title}\nDescription: ${system.description}\nInstall: ${getInstallCommand(system.registryName)}\nDocs URL: ${SITE_URL}/docs/components/${system.route}\n\n`;

    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        docContent += raw;
      } catch {
        // Fallback
      }
    }

    return { content: [{ type: "text", text: docContent }] };
  }

  return {
    isError: true,
    content: [{ type: "text", text: `Unknown tool '${name}'` }],
  };
}

export async function GET() {
  return NextResponse.json({
    server: MCP_SERVER_INFO,
    tools: MCP_TOOLS,
    usage:
      "Send POST requests with JSON-RPC 2.0 payload to call tools or initialize.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

    if (jsonrpc !== "2.0") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: id ?? null,
        error: { code: -32600, message: "Invalid Request: must be JSON-RPC 2.0" },
      });
    }

    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: MCP_SERVER_INFO,
        },
      });
    }

    if (method === "notifications/initialized") {
      return NextResponse.json({ jsonrpc: "2.0", id, result: {} });
    }

    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: { tools: MCP_TOOLS },
      });
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const result = handleToolCall(toolName, toolArgs);
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result,
      });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  } catch (err: any) {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32603, message: err?.message || "Internal error" },
    });
  }
}
