"use client";

import { getAllClients } from "@/api/server/client/getAllClients";
import { findUsers } from "@/api/server/user/findUsers";
import { createWorkItem } from "@/api/server/work-item/createWorkItem";
import { updateWorkItem } from "@/api/server/work-item/updateWorkItem";
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
import { useServerAction } from "@/hooks/useServerAction";
import { work_item_status, work_item_type } from "@bitrock/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const workItemSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, "Il titolo è obbligatorio"),
    client_id: z.string().min(1, "Il cliente è obbligatorio"),
    project_id: z.string().nullable(),
    type: z.nativeEnum(work_item_type),
    start_date: z.string().min(1, "La data di inizio è obbligatoria"),
    end_date: z.string().nullable().optional(),
    enabled_users: z
      .array(z.string())
      .min(1, "Almeno un utente deve essere abilitato"),
    status: z.nativeEnum(work_item_status),
    description: z.string().nullable(),
    hourly_rate: z.number().nullable(),
    estimated_hours: z.number().nullable(),
    fixed_price: z.number().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === work_item_type.time_material) {
      if (data.hourly_rate == null || data.hourly_rate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La tariffa oraria deve essere maggiore di 0",
          path: ["hourly_rate"],
        });
      }
      if (data.estimated_hours == null || data.estimated_hours <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le ore stimate devono essere maggiori di 0",
          path: ["estimated_hours"],
        });
      }
      if (data.fixed_price != null && data.fixed_price !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Il prezzo fisso deve essere vuoto per Time & Material",
          path: ["fixed_price"],
        });
      }
    }
    if (data.type === work_item_type.fixed_price) {
      if (data.fixed_price == null || data.fixed_price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Il prezzo fisso deve essere maggiore di 0",
          path: ["fixed_price"],
        });
      }
      if (data.hourly_rate != null && data.hourly_rate !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La tariffa oraria deve essere vuota per Prezzo Fisso",
          path: ["hourly_rate"],
        });
      }
      if (data.estimated_hours != null && data.estimated_hours !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
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
  editData?: Partial<WorkItemFormData>;
}

export default function AddWorkItemDialog({
  open,
  onOpenChange,
  editData,
}: AddWorkItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editData;
  const [clients, getClients, loadingClients] = useServerAction(getAllClients);
  const [users, getUsers, loadingUsers] = useServerAction(findUsers);

  const form = useForm<WorkItemFormData>({
    resolver: zodResolver(workItemSchema),
    defaultValues: {
      id: editData?.id || "",
      title: editData?.title || "",
      client_id: editData?.client_id || "",
      project_id: editData?.project_id || "",
      type: editData?.type || work_item_type.time_material,
      start_date: editData?.start_date
        ? typeof editData.start_date === "string"
          ? editData.start_date
          : typeof editData.start_date === "object" &&
              editData.start_date !== null &&
              "toISOString" in editData.start_date
            ? (editData.start_date as Date).toISOString().substring(0, 10)
            : ""
        : "",
      end_date: editData?.end_date
        ? typeof editData.end_date === "string"
          ? editData.end_date
          : typeof editData.end_date === "object" &&
              editData.end_date !== null &&
              "toISOString" in editData.end_date
            ? (editData.end_date as Date).toISOString().substring(0, 10)
            : ""
        : "",
      enabled_users: editData?.enabled_users || [],
      status: editData?.status || work_item_status.active,
      description: editData?.description || "",
      hourly_rate: editData?.hourly_rate ?? null,
      estimated_hours: editData?.estimated_hours ?? null,
      fixed_price: editData?.fixed_price ?? null,
    },
  });

  const watchedType = form.watch("type");
  const watchedClientId = form.watch("client_id");

  const onSubmit = async (data: WorkItemFormData) => {
    setIsLoading(true);
    try {
      const submitData = {
        start_date: data.start_date ? new Date(data.start_date) : new Date(),
        end_date: data.end_date ? new Date(data.end_date) : null,
        fixed_price:
          data.type === work_item_type.fixed_price
            ? typeof data.fixed_price === "number"
              ? data.fixed_price
              : null
            : null,
        project_id: data.project_id || null,
        description: data.description ?? null,
        hourly_rate:
          data.type === work_item_type.time_material
            ? typeof data.hourly_rate === "number"
              ? data.hourly_rate
              : null
            : null,
        estimated_hours:
          data.type === work_item_type.time_material
            ? typeof data.estimated_hours === "number"
              ? data.estimated_hours
              : null
            : null,
        title: data.title,
        client_id: data.client_id,
        type: data.type,
        status: data.status,
      };

      console.log({ submitData });

      if (isEditing && editData?.id) {
        await updateWorkItem(editData.id, submitData);
      } else {
        await createWorkItem(submitData);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, [getClients]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Commessa" : "Nuova Commessa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica i dati della commessa esistente."
              : "Inserisci i dati per creare una nuova commessa."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titolo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sviluppo E-commerce Platform"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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

              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progetto (Opzionale)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona progetto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="-">Non Assegnato</SelectItem>
                        {clients
                          ?.find((client) => client.id === watchedClientId)
                          ?.project.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        <SelectItem value={work_item_type.fixed_price}>
                          Prezzo Fisso
                        </SelectItem>
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona stato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={work_item_status.active}>
                          Attiva
                        </SelectItem>
                        <SelectItem value={work_item_status.completed}>
                          Completata
                        </SelectItem>
                        <SelectItem value={work_item_status.on_hold}>
                          In Pausa
                        </SelectItem>
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
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Inizio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
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
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchedType === work_item_type.time_material ? (
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
                          placeholder="65"
                          {...field}
                          value={field.value?.toString() ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? null : Number(val));
                          }}
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
                          placeholder="800"
                          {...field}
                          value={field.value?.toString() ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? null : Number(val));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="fixed_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Fisso (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="15000"
                        {...field}
                        value={field.value?.toString() ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? null : Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                      <FormLabel className="text-base">
                        Utenti Abilitati
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Seleziona gli utenti che possono registrare ore su
                        questa commessa.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {users?.map((user) => (
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
                                        ? field.onChange([
                                            ...field.value,
                                            user.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== user.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {user.name}
                                </FormLabel>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrizione dettagliata della commessa..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annulla
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Salva Modifiche" : "Crea Commessa"}
                </Button>
              </motion.div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
