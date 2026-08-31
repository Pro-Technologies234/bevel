import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
