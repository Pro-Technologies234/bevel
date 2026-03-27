import Link from "next/link";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Wrapper } from "./wrapper";

const navigations = [
  { id: "components", label: "Components", href: "/docs/components" },
  { id: "templates", label: "Templates", href: "/template" },
  { id: "docs", label: "Docs", href: "/docs" },
  { id: "changelogs", label: "Changelog", href: "/changelog" },
];

export function Navbar({ isFixed = true }: { isFixed?: boolean }) {
  return (
    <header
      className={cn(
        "w-full z-50 border-b border-border/60",
        "bg-background/80 backdrop-blur-sm",
        isFixed && "fixed top-0",
      )}
    >
      <Wrapper className="flex flex-row items-center justify-between py-3">
        <nav className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 bg-primary bevel rounded-lg shrink-0" />
            <span className="font-semibold text-xl tracking-tighter font-nohemi">
              Bevel UI
            </span>
          </Link>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {navigations.map((item) => (
              <li key={item.id}>
                <Button variant="ghost" className="cursor-pointer" asChild>
                  <Link href={item.href} className="text-sm font-medium">
                    {item.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ButtonGroup className="max-w-72 hidden sm:flex ">
            <Button size={"icon-lg"} variant={"outline"}>
              <IconSearch />
            </Button>
            <Button size={"lg"} variant={"outline"}>
              Search documentation...
            </Button>
          </ButtonGroup>

          <Button
            size="lg"
            className="px-4 font-semibold tracking-tight cursor-pointer bevel"
          >
            Get Started
          </Button>
        </div>
      </Wrapper>
    </header>
  );
}
