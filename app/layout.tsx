import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BooksProvider } from "@/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "byFood - Take Home",
  description: "Take home assessment for byFood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BooksProvider>
          {children}
        </BooksProvider>
        </body>
    </html>
  );
}
