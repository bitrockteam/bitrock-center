"use client";

import { Button } from "@/components/ui/button";

import { findUserById } from "@/api/server/user/findUserById";
import { useDeleteAllocation } from "@/api/useDeleteAllocation";
import { user } from "@bitrock/db";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function DeleteAllocationDialog({
  open,
  onOpenChange,
  project_id,
  user_id,
  project_name,
  refetch,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project_id: string;
  user_id: string;
  project_name: string;
  refetch: () => void;
}>) {
  const { deleteAllocation } = useDeleteAllocation();

  const [user, setUser] = useState<user>();

  useEffect(() => {
    findUserById(user_id)
      .then((res) => {
        if (res) {
          setUser(res);
        } else {
          toast.error("Utente non trovato");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        toast.error("Errore durante il recupero dell'utente");
      });
  }, [user_id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{"Elimina allocazione"}</DialogTitle>
          <DialogDescription className="py-4">
            {`Sei sicuro di voler rimuovere ${user?.name} dal progetto di ${project_name}?`}
          </DialogDescription>
          <DialogFooter>
            <div className="w-full flex flex-row justify-between items-center">
              <Button>Annulla</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (user?.id)
                    deleteAllocation(project_id, user.id).then((res) => {
                      if (res) {
                        onOpenChange(false);
                        refetch();
                        toast.success("Allocazione eliminata con successo");
                      }
                    });
                }}
              >
                Elimina
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
