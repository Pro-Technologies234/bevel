import { DocsSidebar } from "@/components/docs/shared/docs-sidebar";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { Wrapper } from "@/components/shared/wrapper";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky navbar */}
      <div className="sticky top-0 z-50">
        <Navbar isFixed={false} />
      </div>

      <Wrapper className="flex-1 flex">
        <div className="flex-1 flex">
          {/* Sidebar — sticks below navbar */}
          <aside className="sticky top-[var(--navbar-height,5.5rem)] h-[calc(100vh-var(--navbar-height,6rem))] shrink-0 overflow-y-auto">
            <DocsSidebar />
          </aside>

          {/* Main + Footer */}
          <div className="flex-1 flex flex-col min-w-0">
            {children}
            <Footer />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
