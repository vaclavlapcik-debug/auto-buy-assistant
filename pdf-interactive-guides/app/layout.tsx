import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "PDF Interactive Guides",
  description: "Convert PDF manuals into interactive step-by-step guides.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
