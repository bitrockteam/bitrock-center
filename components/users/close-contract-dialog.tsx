"use client";

import { closeContract } from "@/app/server-actions/contract/closeContract";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { contract } from "@/db";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar, User, XCircle } from "lucide-react";
import { useState } from "react";

interface CloseContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: contract;
  employeeId: string;
}

export default function CloseContractDialog({
  open,
  onOpenChange,
  contract,
  employeeId,
}: CloseContractDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseContract = async () => {
    setIsLoading(true);
    try {
      await closeContract(employeeId, contract.id);
      onOpenChange(false);
      // In a real app, you'd trigger a refetch or update the UI
    } catch (error) {
      console.error("Error closing contract:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case "permanent":
        return "Tempo Indeterminato";
      case "fixed-term":
        return "Tempo Determinato";
      case "freelancer":
        return "Freelancer";
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Chiudi Contratto
          </DialogTitle>
          <DialogDescription>
            Questa azione chiuderà definitivamente il contratto del dipendente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-destructive">Attenzione</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>La chiusura del contratto comporterà:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      Il dipendente verrà impostato come &quot;Non Attivo&quot;
                    </li>
                    <li>Non potrà più essere assegnato a nuovi progetti</li>
                    <li>La data di fine contratto sarà impostata ad oggi</li>
                    <li>Questa azione non può essere annullata</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contract Summary */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Riepilogo Contratto
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RAL:</span>
                  <span className="font-medium">
                    {formatCurrency(contract.ral)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">
                    {getContractTypeLabel(contract.contract_type)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inizio:</span>
                  <span className="font-medium">
                    {formatDate(contract.start_date.toDateString())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stato:</span>
                  <Badge variant="default" className="bg-green-600">
                    Attivo
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Confirmation */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Data di chiusura</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Il contratto verrà chiuso in data:{" "}
              <strong>{formatDate(new Date().toISOString())}</strong>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annulla
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="destructive"
              onClick={handleCloseContract}
              disabled={isLoading}
            >
              {isLoading ? "Chiusura in corso..." : "Conferma Chiusura"}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
