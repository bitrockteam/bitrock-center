"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeleteAllocation } from "@/api/useDeleteAllocation";
import { toast } from "sonner";

export function DeleteAllocationDialog({
  open,
  onOpenChange,
  project_id,
  user_id,
  refetch,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project_id: string;
  user_id: string;
  refetch: () => void;
}>) {
  const { deleteAllocation } = useDeleteAllocation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{"Elimina allocazione"}</DialogTitle>
          <DialogDescription className="py-4">
            {"Sei sicuro di voler eliminare l'allocazione?"}
          </DialogDescription>
          <DialogFooter>
            <div className="w-full flex flex-row justify-between items-center">
              <Button>Annulla</Button>
              <Button
                onClick={() => {
                  deleteAllocation(project_id, user_id).then((res) => {
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
