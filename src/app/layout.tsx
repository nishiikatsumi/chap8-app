import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./_components/Header";

export const metadata: Metadata = {
  title: "Blog",
  description: "Next.js Blog Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
