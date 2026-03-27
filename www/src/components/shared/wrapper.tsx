import { cn } from "@/lib/utils";

export function Wrapper({
  children,
  className,
  wrapper,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  wrapper?: string;
}>) {
  return (
    <div
      className={cn(
        "max-w-[1500px] h-full mx-auto py-1 px-4 lg:px-8 w-full",
        wrapper,
      )}
    >
      <div className={cn("space-y-1 w-full h-full flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
}
