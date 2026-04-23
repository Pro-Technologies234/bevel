// app/api/r/[...slug]/route.ts
// This serves the registry JSON for Pro systems.
// Free systems are served as static files from /public/r/
// Pro systems require a valid license key in the Authorization header.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const slug = (await params).slug.join("/");

  // Determine if this is a Pro registry file
  const isPro = slug.startsWith("pro/");

  if (isPro) {
    // Validate license key from Authorization header
    const authHeader = req.headers.get("authorization");
    const licenseKey = authHeader?.replace("Bearer ", "").trim();

    if (!licenseKey) {
      return NextResponse.json(
        { error: "License key required. Get yours at bevelui.com/dashboard" },
        { status: 401 },
      );
    }

    const license = await prisma.license.findUnique({
      where: { key: licenseKey },
      include: { purchase: true },
    });

    if (!license || !license.active || license.purchase.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Invalid or expired license key." },
        { status: 403 },
      );
    }

    // Log the access
    await prisma.accessLog.create({
      data: {
        userId: license.userId,
        action: "CLI_INSTALL",
        resource: slug,
        ipAddress: req.headers.get("x-forwarded-for"), //?? req.ip,
        userAgent: req.headers.get("user-agent"),
      },
    });
  }

  // Serve the registry JSON from /registry/ folder
  try {
    const filePath = join(process.cwd(), "registry", `${slug}.json`);
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Registry file not found" },
      { status: 404 },
    );
  }
}
