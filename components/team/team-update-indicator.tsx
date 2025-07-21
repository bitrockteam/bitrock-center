"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface TeamUpdateIndicatorProps {
  isUpdating: boolean;
}

export function TeamUpdateIndicator({ isUpdating }: TeamUpdateIndicatorProps) {
  return (
    <AnimatePresence>
      {isUpdating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-background border rounded-lg px-3 py-2 shadow-lg"
        >
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Aggiornamento team...
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
