"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, PlusCircle } from "lucide-react";
import { useState } from "react";
import PermitRequestForm from "./permit-form";

export default function PermitHeader() {
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const handlePermitCreated = () => {
    setShowRequestDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
      >
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ferie e Permessi</h1>
            <p className="text-muted-foreground">Gestisci le tue richieste di ferie e permessi</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setShowRequestDialog(true)} className="transition-all duration-300">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuova Richiesta
          </Button>
        </motion.div>
      </motion.div>

      {showRequestDialog && (
        <PermitRequestForm
          open={showRequestDialog}
          onOpenChange={setShowRequestDialog}
          onPermitCreated={handlePermitCreated}
        />
      )}
    </>
  );
}
