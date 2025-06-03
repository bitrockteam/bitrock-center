import Sidebar from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "../styles/globals.css";
import { AuthProvider } from "./(auth)/AuthProvider";
import { SessionDataProvider } from "./utenti/SessionData";

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
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
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
            <div className="flex h-screen">
              <AuthProvider>
                <SessionDataProvider>
                  {session.data.session && <Sidebar />}
                  <div className="flex-1 overflow-auto">
                    <main className="container py-4 mx-auto px-4 h-full">
                      {children}
                    </main>
                  </div>
                </SessionDataProvider>
              </AuthProvider>
            </div>
            <Toaster />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
