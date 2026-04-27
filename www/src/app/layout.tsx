import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import {
  organizationJsonLd,
  rootMetadata,
  viewport,
  websiteJsonLd,
} from "@/lib/metadata";

const nohemiSans = localFont({
  src: [
    {
      path: "../assets/fonts/nohemi/Nohemi-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/nohemi/Nohemi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/nohemi/Nohemi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/nohemi/Nohemi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/nohemi/Nohemi-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/nohemi/Nohemi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/nohemi/Nohemi-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/nohemi/Nohemi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sans", // Optional: for Tailwind CSS integration
});

const geistMono = Geist({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = rootMetadata;
export { viewport };
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${nohemiSans.variable} ${geistMono.variable} antialiased font-mono selection:bg-foreground dark:bg-black bg-white selection:text-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
