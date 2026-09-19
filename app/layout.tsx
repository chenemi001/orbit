import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Orbit",
    template: "%s | Orbit",
  },
  description:
    "A modern workspace for teams to plan, collaborate, and get work done.",
  applicationName: "Orbit",
  keywords: [
    "Orbit",
    "productivity",
    "project management",
    "tasks",
    "team collaboration",
    "workspace",
  ],
  authors: [
    {
      name: "Orbit",
    },
  ],
  creator: "Orbit",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}