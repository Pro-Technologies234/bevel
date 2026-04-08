import Link from "next/link";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import { IconBoltFilled, IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Wrapper } from "./wrapper";
import { DocsCommandSearch } from "./docs-command-search";

const navigations = [
  { id: "components", label: "Components", href: "/docs/components" },
  { id: "templates", label: "Templates", href: "/" },
  { id: "changelogs", label: "Changelog", href: "/" },
];

export function Navbar({ isFixed = true }: { isFixed?: boolean }) {
  return (
    <header
      className={cn(
        "w-full z-50 border-b border-border/60",
        "bg-background/40  backdrop-blur-sm",
        isFixed && "fixed top-0",
      )}
    >
      <Wrapper className="flex flex-row items-center justify-between py-3">
        <nav className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-start gap-2">
            <div className="size-6 flex justify-center items-center bg-primary bevel rounded-full shrink-0">
              <IconBoltFilled color="black" size={16} />
            </div>
            <span className="font-semibold text-xl tracking-tight font-sans">
              Bevel UI
            </span>
          </Link>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-1 tracking-tight ">
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
          <DocsCommandSearch />
          <Link href={"/docs/introduction"}>
            <Button className=" font-semibold tracking-tight cursor-pointer bevel rounded-lg">
              <IconBoltFilled />
              Get Started
            </Button>
          </Link>
        </div>
      </Wrapper>
    </header>
  );
}
