"use client";

import type { AllocationWithDetails } from "@/app/server-actions/allocation/fetchAllAllocations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/custom/DatePicker";
import { useApi } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editAllocationFormSchema = z
  .object({
    start_date: z.date({ required_error: "La data di inizio è obbligatoria" }),
    end_date: z.date().nullable().optional(),
    percentage: z.number().min(0).max(100),
  })
  .refine((data) => !data.end_date || data.start_date <= data.end_date, {
    message: "La data di fine deve essere successiva o uguale alla data di inizio",
    path: ["end_date"],
  });

type EditAllocationFormData = z.infer<typeof editAllocationFormSchema>;

interface EditAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocation: AllocationWithDetails | null;
  onSuccess?: () => void;
}

export default function EditAllocationDialog({
  open,
  onOpenChange,
  allocation,
  onSuccess,
}: EditAllocationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { callApi: updateAllocationApi } = useApi();

  const form = useForm<EditAllocationFormData>({
    resolver: zodResolver(editAllocationFormSchema),
    defaultValues: {
      start_date: new Date(),
      end_date: null,
      percentage: 100,
    },
  });

  useEffect(() => {
    if (allocation && open) {
      form.reset({
        start_date: new Date(allocation.start_date),
        end_date: allocation.end_date ? new Date(allocation.end_date) : null,
        percentage: allocation.percentage,
      });
    }
  }, [allocation, open, form]);

  const onSubmit = async (data: EditAllocationFormData) => {
    if (!allocation) return;

    setIsLoading(true);
    try {
      await updateAllocationApi("/api/allocation", {
        method: "PUT",
        body: JSON.stringify({
          user_id: allocation.user_id,
          work_item_id: allocation.work_item_id,
          start_date: data.start_date.toISOString(),
          end_date: data.end_date ? data.end_date.toISOString() : null,
          percentage: data.percentage,
        }),
      });

      toast.success("Allocazione aggiornata con successo");
      onOpenChange(false);
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating allocation:", error);
      toast.error("Errore durante l'aggiornamento dell'allocazione");
    } finally {
      setIsLoading(false);
    }
  };

  if (!allocation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifica Allocazione</DialogTitle>
          <DialogDescription>
            Modifica i dettagli dell'allocazione per {allocation.user.name} su{" "}
            {allocation.work_items.title}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="user-name" className="text-sm font-medium">
                Utente
              </label>
              <Input id="user-name" value={allocation.user.name} disabled />
            </div>

            <div className="space-y-2">
              <label htmlFor="work-item-title" className="text-sm font-medium">
                Commessa
              </label>
              <Input id="work-item-title" value={allocation.work_items.title} disabled />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Inizio *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date || new Date())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fine (Opzionale)</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value || undefined}
                        setDate={(date) => field.onChange(date || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentuale (%) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salva Modifiche
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
