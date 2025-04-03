"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="it">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background text-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Errore critico
              </h1>
              <p className="text-muted-foreground">
                Si è verificato un errore critico nell&apos;applicazione.
              </p>
              {error.message && process.env.NODE_ENV === "development" && (
                <div className="mt-4 rounded-md bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">
                    {error.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={reset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Riprova
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
