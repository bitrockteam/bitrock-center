"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function SkillsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">Gestione delle competenze aziendali</p>
        </div>
      </div>
    </motion.div>
  );
}
