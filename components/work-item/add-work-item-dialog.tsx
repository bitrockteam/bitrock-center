"use client";

import type { GetAllClientsResponse } from "@/app/server-actions/client/getAllClients";
import type { FindUsers } from "@/app/server-actions/user/findUsers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { work_item_status, work_item_type } from "@/db";
import { useApi } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const workItemSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, "Il titolo è obbligatorio"),
    client_id: z.string().min(1, "Il cliente è obbligatorio"),
    project_id: z.string().optional(),
    type: z.enum([work_item_type.time_material, work_item_type.fixed_price]),
    status: z.enum([work_item_status.active, work_item_status.completed, work_item_status.on_hold]),
    description: z.string().optional(),
    hourly_rate: z.number().nullable().optional(),
    estimated_hours: z.number().nullable().optional(),
    fixed_price: z.number().nullable().optional(),
    enabled_users: z.array(z.string()).min(1, "Seleziona almeno un utente"),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === work_item_type.time_material) {
      if (!data.hourly_rate || data.hourly_rate <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "La tariffa oraria deve essere maggiore di 0",
          path: ["hourly_rate"],
        });
      }
      if (!data.estimated_hours || data.estimated_hours <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Le ore stimate devono essere maggiori di 0",
          path: ["estimated_hours"],
        });
      }
      if (data.fixed_price && data.fixed_price > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Il prezzo fisso deve essere vuoto per Time & Material",
          path: ["fixed_price"],
        });
      }
    }
    if (data.type === work_item_type.fixed_price) {
      if (!data.fixed_price || data.fixed_price <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Il prezzo fisso deve essere maggiore di 0",
          path: ["fixed_price"],
        });
      }
      if (data.hourly_rate && data.hourly_rate > 0) {
        ctx.addIssue({
          code: "custom",
          message: "La tariffa oraria deve essere vuota per Prezzo Fisso",
          path: ["hourly_rate"],
        });
      }
      if (data.estimated_hours && data.estimated_hours > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Le ore stimate devono essere vuote per Prezzo Fisso",
          path: ["estimated_hours"],
        });
      }
    }
  });

type WorkItemFormData = z.infer<typeof workItemSchema>;

interface AddWorkItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: WorkItemFormData;
  canCreateWorkItem?: boolean;
}

export default function AddWorkItemDialog({
  open,
  onOpenChange,
  editData,
  canCreateWorkItem = false,
}: AddWorkItemDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editData;

  const {
    data: clients,
    callApi: fetchClients,
    loading: loadingClients,
  } = useApi<GetAllClientsResponse[]>();
  const { data: users, callApi: fetchUsers, loading: loadingUsers } = useApi<FindUsers[]>();
  const { callApi: createWorkItemApi } = useApi();
  const { callApi: updateWorkItemApi } = useApi();

  const getNewFormValues = useCallback((): WorkItemFormData => {
    return {
      id: editData?.id || "",
      title: editData?.title || "",
      client_id: editData?.client_id || "",
      project_id: editData?.project_id || "",
      type: editData?.type || work_item_type.time_material,
      start_date: editData?.start_date || "",
      end_date: editData?.end_date || "",
      enabled_users: editData?.enabled_users || [],
      status: editData?.status || work_item_status.active,
      description: editData?.description || "",
      hourly_rate: editData?.hourly_rate ?? null,
      estimated_hours: editData?.estimated_hours ?? null,
      fixed_price: editData?.fixed_price ?? null,
    };
  }, [editData]);

  const form = useForm<WorkItemFormData>({
    resolver: zodResolver(workItemSchema),
    defaultValues: getNewFormValues(),
  });

  const watchedType = form.watch("type");

  const onSubmit = async (data: WorkItemFormData) => {
    setIsLoading(true);
    try {
      // Prepare work item data based on type
      const workItemData = {
        title: data.title,
        client_id: data.client_id,
        project_id: data.project_id || null,
        type: data.type,
        status: data.status,
        description: data.description || null,
        // start_date is required in the database, use today's date if not provided
        // Send as string to avoid timezone issues, will be converted to Date on server
        start_date:
          data.start_date && dayjs(data.start_date).isValid()
            ? dayjs(data.start_date).toISOString()
            : dayjs().toISOString(),
        end_date: data.end_date || null,
        // Set fields based on type to match database constraints
        hourly_rate: data.type === work_item_type.time_material ? data.hourly_rate : null,
        estimated_hours: data.type === work_item_type.time_material ? data.estimated_hours : null,
        fixed_price: data.type === work_item_type.fixed_price ? data.fixed_price : null,
      };

      console.log({ workItemData, data_start: data.start_date });

      if (isEditing) {
        await updateWorkItemApi("/api/work-item/update", {
          method: "PUT",
          body: JSON.stringify({
            id: data.id,
            updates: workItemData,
            enabled_users: data.enabled_users,
          }),
        });
        toast.success("Commessa aggiornata con successo");
      } else {
        await createWorkItemApi("/api/work-item/create", {
          method: "POST",
          body: JSON.stringify({
            workItem: workItemData,
            enabled_users: data.enabled_users,
          }),
        });
        toast.success("Commessa creata con successo");
      }

      onOpenChange(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error saving work item:", error);
      toast.error(isEditing ? "Errore durante l'aggiornamento" : "Errore durante la creazione");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchClients("/api/client/search");
      fetchUsers("/api/user/search");
    }
  }, [open, fetchClients, fetchUsers]);

  useEffect(() => {
    if (editData) {
      form.reset(getNewFormValues());
    }
  }, [editData, form, getNewFormValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifica Commessa" : "Nuova Commessa"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica i dettagli della commessa."
              : "Inserisci i dettagli per creare una nuova commessa."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              disabled={!canCreateWorkItem}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titolo</FormLabel>
                  <FormControl>
                    <Input placeholder="Titolo della commessa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!canCreateWorkItem}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={work_item_type.time_material}>
                          Time & Material
                        </SelectItem>
                        <SelectItem value={work_item_type.fixed_price}>Prezzo Fisso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stato</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!canCreateWorkItem}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona stato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={work_item_status.active}>Attiva</SelectItem>
                        <SelectItem value={work_item_status.completed}>Completata</SelectItem>
                        <SelectItem value={work_item_status.on_hold}>In Pausa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("project_id", ""); // Reset project when client changes
                        }}
                        disabled={!canCreateWorkItem}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client: GetAllClientsResponse) => (
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

              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => {
                  const selectedClient = clients?.find((c) => c.id === form.watch("client_id"));
                  const projects = selectedClient?.project || [];
                  return (
                    <FormItem>
                      <FormLabel>Progetto (Opzionale)</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedClient || projects.length === 0 || !canCreateWorkItem}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona progetto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project: GetAllClientsResponse["project"][number]) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                disabled={!canCreateWorkItem}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Inizio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                disabled={!canCreateWorkItem}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fine (Opzionale)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchedType === work_item_type.time_material && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hourly_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tariffa Oraria (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          disabled={!canCreateWorkItem}
                          placeholder="0.00"
                          value={field.value?.toString() || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ore Stimate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          disabled={!canCreateWorkItem}
                          placeholder="0"
                          value={field.value?.toString() || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {watchedType === work_item_type.fixed_price && (
              <FormField
                control={form.control}
                name="fixed_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Fisso (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        disabled={!canCreateWorkItem}
                        placeholder="0.00"
                        value={field.value?.toString() || ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              disabled={!canCreateWorkItem}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione (Opzionale)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrizione della commessa..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled_users"
              render={() =>
                loadingUsers ? (
                  <FormItem>
                    <FormControl>
                      <Input disabled value="Caricamento utenti..." />
                    </FormControl>
                  </FormItem>
                ) : (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Utenti Abilitati</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Seleziona gli utenti che possono registrare ore su questa commessa.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {users?.map((user: FindUsers) => (
                        <FormField
                          key={user.id}
                          control={form.control}
                          name="enabled_users"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={user.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(user.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, user.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== user.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">{user.name}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annulla
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Aggiorna" : "Crea"} Commessa
                </Button>
              </motion.div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
