import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ContentProviders from "./contentProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Point of Sale",
  description: "Robust Point of Sale System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <ContentProviders>{children}</ContentProviders>
      </body>
    </html>
  );
}
