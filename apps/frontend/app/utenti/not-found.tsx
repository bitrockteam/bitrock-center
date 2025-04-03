"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
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
          <div className="rounded-full bg-muted p-4">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Utente non trovato
          </h1>
          <p className="text-muted-foreground">
            L&apos;utente che stai cercando non esiste o è stato rimosso.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push("/utenti")}
              className="w-full sm:w-auto"
            >
              <Users className="mr-2 h-4 w-4" />
              Tutti gli Utenti
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Torna alla Dashboard
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
