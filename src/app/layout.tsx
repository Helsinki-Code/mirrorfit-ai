import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";

export const metadata: Metadata = {
  title: {
    default: "MirrorFit AI",
    template: "%s | MirrorFit AI",
  },
  description:
    "Chat-first virtual try-on platform for fashion ecommerce teams. Upload authorized model references, upload garments, and generate catalogue-ready visuals in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
