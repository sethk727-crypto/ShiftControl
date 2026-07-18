import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SK ShiftControl — Client Portal",
  description: "Secure client portal for SK ShiftControl deployments.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
