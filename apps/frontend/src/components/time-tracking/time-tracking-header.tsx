"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddHoursDialog from "./add-hours-dialog";
import { useState } from "react";

export default function TimeTrackingHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consuntivazione</h1>
        <p className="text-muted-foreground">Gestisci le tue ore lavorate</p>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Aggiungi Ore
        </Button>
      </motion.div>

      <AddHoursDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </motion.div>
  );
}
