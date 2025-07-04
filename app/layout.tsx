import MainContainer from "@/components/main-container";
import { tryGetUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitrock Hours",
  description: "Gestione presenze, ferie e permessi",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await tryGetUserInfoFromCookie();
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Suspense>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MainContainer user={user}>{children}</MainContainer>
            <Toaster />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic"; // Force dynamic rendering for this layout
