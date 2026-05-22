// ─── Footer ───────────────────────────────────────────────────────────────

import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Wrapper } from "./wrapper";

export function Footer() {
  return (
    <Wrapper>
      <footer className="w-full py-8 border-t border-border/60">
        <div className="  flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left — brand */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm tracking-tight">
              Built By <a href="https://x.com/EgaamPoyeKitoye">Poye Kitoye</a>{" "}
              with ❤️
            </span>
          </div>

          {/* Right — links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/poyekitoye"
              target="_blank"
              rel="noopener noreferrer"
              className=" "
            >
              <Button
                size={"icon"}
                variant={"secondary"}
                className="cursor-pointer"
              >
                <IconBrandGithub size={18} strokeWidth={1.5} />
              </Button>
            </a>
            <a
              href="https://x.com/EgaamPoyeKitoye"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <Button
                size={"icon"}
                variant={"secondary"}
                className="cursor-pointer"
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
    </Wrapper>
  );
}
