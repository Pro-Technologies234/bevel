import Link from "next/link";
import { Button } from "../ui/button";
import { GlowEffect } from "../ui/glow-effect";

export function Navbar() {
  const navigations = [
    { id: "components", label: "Components", href: "/components" },
    { id: "docs", label: "Docs", href: "/docs" },
    { id: "showcase", label: "Showcase", href: "/showcase" },
  ];

  return (
    <div className=" relative">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4  dark:bg-black ">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary bevel rounded-lg" />
          <span className="font-bold text-xl tracking-tight font-nohemi">
            Bevel UI
          </span>
        </div>

        <nav>
          <ul className="flex items-center gap-6">
            {navigations.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="text-sm font-medium ">
                  <Button
                    size={"lg"}
                    variant={"ghost"}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Button size={"lg"} className="px-4 font-semibold cursor-pointer">
            Get Started
          </Button>
        </div>
      </header>
      <GlowEffect
        colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
        mode="static"
        blur="strongest"
        duration={0.2}
        className="-z-10 p-8 opacity-20 -inset-x-6" // ensures it stays behind the button
      />
    </div>
  );
}
