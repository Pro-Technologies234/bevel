import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconBrandFramerMotion,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandTypescript,
  IconChevronRight,
} from "@tabler/icons-react";

export function Hero() {
  const brands = [
    { label: "React", icon: IconBrandReact },
    { label: "Typscript", icon: IconBrandTypescript },
    { label: "Tailwincss", icon: IconBrandTailwind },
    { label: "Motion", icon: IconBrandFramerMotion },
    // {label: "Framer "},
  ];
  return (
    <main className=" h-screen flex items-center flex-col justify-center  space-y-4 ">
      <h1 className=" text-7xl font-sans font-medium max-w-2xl text-center tracking-tight">
        UI components for Serious Developers
      </h1>
      <p className=" max-w-xl text-center">
        A copy-to-own component system for React that delivers real, editable
        components into your codebase — built with React, TypeScript, Tailwind
        CSS, and Motion, with no installs, no lock-in, and full compatibility
        with shadcn/ui.
      </p>
      <div className=" flex items-center gap-4">
        <div className="relative">
          <GlowEffect
            colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
            mode="static"
            blur="medium"
            className="z-1 bottom-0 inset-x-0 top-8 h-2" // ensures it stays behind the button
          />
          <Button variant={"inverted"} className="p-4.5 px-8 cursor-pointer">
            Browse Components <IconChevronRight />
          </Button>
        </div>
        <Button className="p-4.5 px-8 cursor-pointer bevel">
          Browse Templates <IconChevronRight />
        </Button>
      </div>
      <div className=" flex items-center gap-2 mt-8">
        {brands.map((brand) => (
          <Tooltip>
            <TooltipTrigger>
              <brand.icon size={40} strokeWidth={1.1} />
            </TooltipTrigger>
            <TooltipContent>{brand.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </main>
  );
}
