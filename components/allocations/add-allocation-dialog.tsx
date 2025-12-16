"use client";

import type { GetAllClientsResponse } from "@/app/server-actions/client/getAllClients";
import type { FindUsers } from "@/app/server-actions/user/findUsers";
import type { WorkItemForAllocation } from "@/app/server-actions/allocation/fetchWorkItemsForAllocation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/custom/DatePicker";
import { useApi } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const allocationFormSchema = z
  .object({
    client_id: z.string().min(1, "Il cliente è obbligatorio"),
    work_item_id: z.string().min(1, "La commessa è obbligatoria"),
    user_id: z.string().min(1, "L'utente è obbligatorio"),
    start_date: z.date(),
    end_date: z.date().nullable().optional(),
    percentage: z.number().min(0).max(100),
  })
  .refine((data) => !data.end_date || data.start_date <= data.end_date, {
    message: "La data di fine deve essere successiva o uguale alla data di inizio",
    path: ["end_date"],
  });

type AllocationFormData = z.infer<typeof allocationFormSchema>;

interface AddAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddAllocationDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddAllocationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    data: clients,
    callApi: fetchClients,
    loading: loadingClients,
  } = useApi<GetAllClientsResponse[]>();
  const {
    data: workItems,
    callApi: fetchWorkItems,
    loading: loadingWorkItems,
  } = useApi<WorkItemForAllocation[]>();
  const { data: users, callApi: fetchUsers, loading: loadingUsers } = useApi<FindUsers[]>();
  const { callApi: createAllocationApi } = useApi();

  const form = useForm<AllocationFormData>({
    resolver: zodResolver(allocationFormSchema),
    defaultValues: {
      client_id: "",
      work_item_id: "",
      user_id: "",
      start_date: new Date(),
      end_date: null,
      percentage: 100,
    },
  });

  const watchedClientId = form.watch("client_id");

  useEffect(() => {
    if (open) {
      fetchClients("/api/client/search");
      fetchUsers("/api/user/search");
      form.reset();
      setStep(1);
    }
  }, [open, fetchClients, fetchUsers, form]);

  useEffect(() => {
    if (watchedClientId) {
      fetchWorkItems(`/api/allocation/work-items?client_id=${watchedClientId}`);
      // Reset work item when client changes
      if (form.getValues("work_item_id")) {
        form.setValue("work_item_id", "");
      }
    }
  }, [watchedClientId, fetchWorkItems, form]);

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await form.trigger("client_id");
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isValid = await form.trigger("work_item_id");
      if (isValid) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: AllocationFormData) => {
    setIsLoading(true);
    try {
      await createAllocationApi("/api/allocation", {
        method: "POST",
        body: JSON.stringify({
          work_item_id: data.work_item_id,
          user_id: data.user_id,
          percentage: data.percentage,
          start_date: data.start_date.toISOString(),
          end_date: data.end_date ? data.end_date.toISOString() : null,
        }),
      });

      toast.success("Allocazione creata con successo");
      onOpenChange(false);
      form.reset();
      setStep(1);
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating allocation:", error);
      toast.error("Errore durante la creazione dell'allocazione");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuova Allocazione</DialogTitle>
          <DialogDescription>
            Assegna un utente a una commessa con date e percentuale di allocazione
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= 1
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {step > 1 ? (
                  <span className="text-sm font-medium">✓</span>
                ) : (
                  <span className="text-sm font-medium">1</span>
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= 1 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Cliente
              </span>
            </div>
            <div className="flex-1 h-0.5 mx-4 bg-muted">
              <div
                className={`h-full transition-all ${step >= 2 ? "bg-primary" : "bg-muted"}`}
                style={{ width: step >= 2 ? "100%" : "0%" }}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= 2
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {step > 2 ? (
                  <span className="text-sm font-medium">✓</span>
                ) : (
                  <span className="text-sm font-medium">2</span>
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= 2 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Commessa
              </span>
            </div>
            <div className="flex-1 h-0.5 mx-4 bg-muted">
              <div
                className={`h-full transition-all ${step >= 3 ? "bg-primary" : "bg-muted"}`}
                style={{ width: step >= 3 ? "100%" : "0%" }}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= 3
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                <span className="text-sm font-medium">3</span>
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= 3 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Dettagli
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) =>
                  loadingClients ? (
                    <FormItem>
                      <FormControl>
                        <Input disabled value="Caricamento clienti..." />
                      </FormControl>
                    </FormItem>
                  ) : (
                    <FormItem>
                      <FormLabel>Cliente *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }
              />
            )}

            {step === 2 && (
              <FormField
                control={form.control}
                name="work_item_id"
                render={({ field }) =>
                  loadingWorkItems ? (
                    <FormItem>
                      <FormControl>
                        <Input disabled value="Caricamento commesse..." />
                      </FormControl>
                    </FormItem>
                  ) : (
                    <FormItem>
                      <FormLabel>Commessa *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona commessa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workItems?.map((workItem) => (
                            <SelectItem key={workItem.id} value={workItem.id}>
                              {workItem.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }
              />
            )}

            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) =>
                    loadingUsers ? (
                      <FormItem>
                        <FormControl>
                          <Input disabled value="Caricamento utenti..." />
                        </FormControl>
                      </FormItem>
                    ) : (
                      <FormItem>
                        <FormLabel>Utente *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona utente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users?.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }
                />

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
              </>
            )}

            <DialogFooter>
              <div className="flex justify-between w-full">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                    Indietro
                  </Button>
                )}
                <div className="flex gap-2 ml-auto">
                  {step < 3 ? (
                    <Button type="button" onClick={handleNext} disabled={isLoading}>
                      Avanti
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Crea Allocazione
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
