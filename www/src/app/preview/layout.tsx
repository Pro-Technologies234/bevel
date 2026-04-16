// app/preview/layout.tsx
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-background text-foreground">{children}</div>
    </div>
  );
}
