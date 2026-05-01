import { ThemeProvider } from "@/components/providers/theme-provider";
import { FloatingModeToggle } from "@/components/shared/mode-toggle";

// app/preview/layout.tsx
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="bg-background text-foreground">{children}</div>
      <FloatingModeToggle />
    </ThemeProvider>
  );
}
