import { DocsSidebar } from "@/components/docs/shared/docs-sidebar";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar isFixed={false} />
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-1 flex justify-between">
          <DocsSidebar/>
          <div className="flex-1 flex flex-col justify-between h-full">
            {children}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
