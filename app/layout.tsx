import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "NerveCore - Conquer DeFi",
  description: "A dark fantasy RPG interface for DeFi protocols on Sui Network with zkLogin authentication",
  keywords: ["DeFi", "Sui", "RPG", "Gaming", "Blockchain", "zkLogin"],
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
