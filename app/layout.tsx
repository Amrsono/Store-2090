import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Modern Fashion - 2090s Modern Style | Clothes, Shoes & Bags",
  description: "Discover the future of fashion with cutting-edge 2090s modern style. Premium clothes, shoes, and bags with quantum-tech materials and holographic designs.",
  keywords: ["Fashion", "Modern", "2090s Style", "Clothes", "Shoes", "Bags", "Streetwear", "E-commerce"],
  authors: [{ name: "Modern Fashion" }],
  openGraph: {
    title: "Modern Fashion - 2090s Modern Store",
    description: "Premium fashion from the future - clothes, shoes, and bags",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased font-inter`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
