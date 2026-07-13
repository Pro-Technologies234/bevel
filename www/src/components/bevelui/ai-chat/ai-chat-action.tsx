import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIChatActionProps extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "children"> {
  children: React.ReactNode;
}

export function AIChatAction({ children, variant = "outline", className, ...props }: AIChatActionProps) {
  return (
    <Button variant={variant} {...props} className={cn("cursor-pointer", className)}>
      {children}
    </Button>
  );
}
