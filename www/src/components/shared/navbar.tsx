import Link from "next/link";
import { Button } from "../ui/button";
import { GlowEffect } from "../ui/glow-effect";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function Navbar({ isFixed = true }: { isFixed?: boolean }) {
  const navigations = [
    { id: "components", label: "Components", href: "/docs/components" },
    { id: "templates", label: "Templates", href: "/template" },
    { id: "docs", label: "Docs", href: "/docs" },
    { id: "changelogs", label: "Changelog", href: "/docs" },
  ];

  return (
    <header
      className={cn(
        " w-full z-50 flex justify-between items-center px-6 py-3 dark:bg-linear-to-t from-black/40 from-10% via-black to-black select-none ",
        isFixed && "fixed top-0",
      )}
    >
      <nav className="flex items-center gap-8">
        <Link href={"/"} className="flex items-center gap-2 flex-1">
          <div className="size-8 bg-primary bevel rounded-lg" />
          <span className="font-semibold text-xl tracking-tighter font-nohemi">
            Bevel UI
          </span>
        </Link>
        <ul className="flex items-center gap-2">
          {navigations.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="text-sm font-medium ">
                <Button variant={"ghost"} className="cursor-pointer">
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center justify-end gap-4 flex-1">
        <InputGroup className="max-w-72">
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search documentation..." />
        </InputGroup>
        <Button size={"lg"} className="px-4 font-semibold cursor-pointer bevel">
          Get Started
        </Button>
      </div>
    </header>
  );
}
