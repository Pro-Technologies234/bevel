import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import { Separator } from "@/components/ui/separator";
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
    { label: "Tailwin CSS", icon: IconBrandTailwind },
    { label: "Motion", icon: IconBrandFramerMotion },
    // {label: "Framer "},
  ];
  return (
    <main className=" h-[48rem] flex items-center flex-col justify-center  space-y-4 ">
      <Badge
        variant={"secondary"}
        className="bg-muted/80 hover:bg-muted border! border-border/70! p-3.5 gap-2 text-xs uppercase select-none "
      >
        <span className="h-1.5 w-1.5 rounded-full dark:bg-green-400 bg-green-600" />
        Engineering-first UI Systems
      </Badge>
      <h1 className=" text-6xl font-sans font-medium max-w-xl text-center tracking-tight">
        The UI Systems Your App Actually Needs
      </h1>
      <p className=" max-w-lg text-center">
        Bevel gives you fully-engineered, copy-to-own UI systems — not just
        components. Every system is built to drop straight into your codebase
        with no installs, no lock-in, and full shadcn compatibility.
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
            <span className="z-1" >Browse Systems</span> <IconChevronRight />
          </Button>
        </div>
        <Button className="p-4.5 px-8 cursor-pointer bevel">
          Browse Templates <IconChevronRight />
        </Button>
      </div>
      <div className=" flex items-center gap-2 mt-8">
        {brands.map((brand) => (
          <Tooltip key={brand.label}>
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
