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
  user,
  project_name,
  refetch,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project_id: string;
  user: { user_id: string; name: string };
  project_name: string;
  refetch: () => void;
}>) {
  const { deleteAllocation } = useDeleteAllocation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{"Elimina allocazione"}</DialogTitle>
          <DialogDescription className="py-4">
            {`Sei sicuro di voler rimuovere ${user.name} dal progetto di ${project_name}?`}
          </DialogDescription>
          <DialogFooter>
            <div className="w-full flex flex-row justify-between items-center">
              <Button>Annulla</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteAllocation(project_id, user.user_id).then((res) => {
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
