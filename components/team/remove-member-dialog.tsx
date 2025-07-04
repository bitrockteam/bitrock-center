"use client";

import { motion } from "framer-motion";
import { Trash2, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TeamMember } from "./types";

interface RemoveMemberDialogProps {
  teamMember: TeamMember;
  onConfirm: () => Promise<void>;
  disabled?: boolean;
}

export function RemoveMemberDialog({
  teamMember,
  onConfirm,
  disabled = false,
}: RemoveMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onConfirm();
      setOpen(false);
      toast.success(`${teamMember.name} rimosso dal team con successo`);
    } catch {
      toast.error("Errore nella rimozione del membro dal team");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={disabled}
          aria-label={`Rimuovi ${teamMember.name} dal team`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-destructive" />
            Rimuovi membro dal team
          </DialogTitle>
          <DialogDescription>
            Sei sicuro di voler rimuovere <strong>{teamMember.name}</strong> dal
            team? Questa azione non può essere annullata.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isRemoving}
          >
            Annulla
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Rimuovendo...
                </>
              ) : (
                "Rimuovi"
              )}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
