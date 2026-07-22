import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "../ui/badge";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center flex-1 gap-2", className)}>
      <BevelIcon className="size-6! shrink-0 text-primary -translate-y-1" />
      <span className=" font-bold tracking-tight text-lg ">Bevel UI</span>
      <Badge className="text-[10px] rounded-full bg-primary/10 text-primary border-none shadow-none uppercase tracking-widest font-semibold px-2 py-0.5 ml-1">BETA</Badge>
    </div>
  );
}

export function BevelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="550 200 500 550"
      fill="currentColor"
      className={cn("size-full", props.className)}
      {...props}
    >
      <path d="M613.3 259.2c-7.8 3.3-15.7 7.3-17.5 8.8l-3.3 2.8-.3 178.8c-.2 158-.1 179.8 1.3 186.9 3 15.7 14.4 33.9 27.2 43.7 3.2 2.5 18.9 12.6 34.8 22.5 16 9.9 47.9 29.8 70.9 44.2 23.1 14.4 43.1 26.4 44.4 26.8 1.6.4 3.3-.1 5-1.4l2.7-2 .3-201.9c.2-144.9 0-203.6-.8-207.9-.6-3.3-2.9-9.8-5.1-14.3-5.2-10.8-13-18.7-25.9-26.3-5.2-3.1-27.5-16.3-49.5-29.4-57.5-34.2-63.4-37.5-66.9-37.5-1.7 0-9.5 2.8-17.3 6.2m202.2 111.6c-10.1 4.7-10.8 5.2-12.8 8.2-1.6 2.3-1.7 16-1.7 196.3v193.9l2.9 2.9c5.2 5.2 5.9 4.9 48.6-18.9C983.7 680 975.6 685 981.7 673.3c6.5-12.3 6.3-8.9 6.3-94 0-66.6-.2-78.5-1.6-85.1-1.9-9.4-6.3-20.5-11.1-28.7-5.3-8.6-20.2-23-29.8-28.7-4.4-2.6-32.5-19.3-62.5-37.2-33.7-20.2-55.4-32.6-57-32.6-1.4 0-6.1 1.7-10.5 3.8" />
    </svg>
  );
}
