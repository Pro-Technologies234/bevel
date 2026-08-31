import Link from "next/link";
import { IconChevronRight, IconArrowLeft } from "@tabler/icons-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <Link href="/" className="absolute top-6 left-6">
        <BrandMark />
      </Link>

      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
        404
      </span>
      <h1 className="text-4xl md:text-6xl font-sans font-medium tracking-tight">
        This page doesn&apos;t exist.
      </h1>
      <p className="text-muted-foreground max-w-sm text-sm md:text-base leading-relaxed">
        Either the link is wrong, or the page moved. Every system still lives
        in the docs.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
        <Link href="/">
          <Button variant="outline" size="lg">
            <IconArrowLeft size={14} /> Back home
          </Button>
        </Link>
        <Link href="/docs/components">
          <Button variant="inverted" size="lg">
            Browse systems <IconChevronRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}
