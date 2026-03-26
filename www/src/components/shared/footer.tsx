// ─── Footer ───────────────────────────────────────────────────────────────

import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/60">
      <div className=" mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left — brand */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            Built By{" "}
            <a
              href="https://poyekitoye.vercel.app"
              className=" text-blue-500 font-sans"
            >
              Poye Kitoye
            </a>
          </span>
        </div>

        {/* Right — links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className=" "
          >
            <Button
              size={"icon"}
              variant={"secondary"}
              className="bg-primary/10 text-primary cursor-pointer"
            >
              <IconBrandGithub size={18} strokeWidth={1.5} />
            </Button>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className=" "
          >
            <Button
              size={"icon"}
              variant={"secondary"}
              className="bg-primary/10 text-primary cursor-pointer"
            >
              <IconBrandX size={18} strokeWidth={1.5} />
            </Button>
          </a>
          <span className="text-muted-foreground/50 text-xs">
            © {new Date().getFullYear()} Bevel UI
          </span>
        </div>
      </div>
    </footer>
  );
}
