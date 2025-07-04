"use client";

import { Button } from "@/components/ui/button";

import { deleteAllocation } from "@/app/server-actions/allocation/deleteAllocation";
import { findUserById } from "@/app/server-actions/user/findUserById";
import { useServerAction } from "@/hooks/useServerAction";
import { useEffect } from "react";
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
  const [user, fetchUserById] = useServerAction(findUserById);

  useEffect(() => {
    if (!user_id) return;
    fetchUserById(user_id);
  }, [fetchUserById, user_id]);

  if (!open) return null;

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
                    deleteAllocation({ project_id, user_id: user.id }).then(
                      (res) => {
                        if (res) {
                          onOpenChange(false);
                          refetch();
                          toast.success("Allocazione eliminata con successo");
                        }
                      },
                    );
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
