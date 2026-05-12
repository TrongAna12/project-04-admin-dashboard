import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";

import { RootProvider } from "@/providers";

export const metadata: Metadata = {
  title: "AdminLTE Dashboard - Enterprise Admin Panel",
  description:
    "Modern enterprise admin dashboard built with Next.js and React",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full"
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
