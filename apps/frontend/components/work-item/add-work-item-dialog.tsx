"use client";

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
import {
  createWorkItem,
  getAllClients,
  getAllUsers,
  getProjectsByClient,
  updateWorkItem,
} from "@/lib/mock-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const workItemSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  clientId: z.string().min(1, "Il cliente è obbligatorio"),
  projectId: z.string().optional(),
  type: z.enum(["time-material", "fixed-price"]),
  startDate: z.string().min(1, "La data di inizio è obbligatoria"),
  endDate: z.string().optional(),
  enabledUsers: z
    .array(z.string())
    .min(1, "Almeno un utente deve essere abilitato"),
  status: z.enum(["active", "completed", "on-hold"]),
  description: z.string().optional(),
  hourlyRate: z.number().optional(),
  estimatedHours: z.number().optional(),
  fixedPrice: z.number().optional(),
});

type WorkItemFormData = z.infer<typeof workItemSchema>;

interface AddWorkItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: any;
}

export default function AddWorkItemDialog({
  open,
  onOpenChange,
  editData,
}: AddWorkItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const isEditing = !!editData;

  const clients = getAllClients();
  const users = getAllUsers();

  const form = useForm<WorkItemFormData>({
    resolver: zodResolver(workItemSchema),
    defaultValues: {
      title: editData?.title || "",
      clientId: editData?.clientId || "defaultClientId", // Updated default value
      projectId: editData?.projectId || "",
      type: editData?.type || "time-material",
      startDate: editData?.startDate || "",
      endDate: editData?.endDate || "",
      enabledUsers: editData?.enabledUsers || [],
      status: editData?.status || "active",
      description: editData?.description || "",
      hourlyRate: editData?.hourlyRate || 0,
      estimatedHours: editData?.estimatedHours || 0,
      fixedPrice: editData?.fixedPrice || 0,
    },
  });

  const watchedType = form.watch("type");
  const watchedClientId = form.watch("clientId");

  useEffect(() => {
    if (watchedClientId) {
      setSelectedClient(watchedClientId);
      const projects = getProjectsByClient(watchedClientId);
      setAvailableProjects(projects);
    } else {
      setAvailableProjects([]);
    }
  }, [watchedClientId]);

  useEffect(() => {
    if (editData?.clientId) {
      setSelectedClient(editData.clientId);
      const projects = getProjectsByClient(editData.clientId);
      setAvailableProjects(projects);
    }
  }, [editData]);

  const onSubmit = async (data: WorkItemFormData) => {
    setIsLoading(true);
    try {
      const submitData = {
        ...data,
        projectId: data.projectId || null,
        endDate: data.endDate || null,
      };

      if (isEditing) {
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="clientId"
                render={({ field }) => (
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
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progetto (Opzionale)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona progetto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nessun progetto</SelectItem>
                        {availableProjects.map((project) => (
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
                        <SelectItem value="time-material">
                          Time & Material
                        </SelectItem>
                        <SelectItem value="fixed-price">
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
                        <SelectItem value="active">Attiva</SelectItem>
                        <SelectItem value="completed">Completata</SelectItem>
                        <SelectItem value="on-hold">In Pausa</SelectItem>
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
                name="startDate"
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
                name="endDate"
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

            {watchedType === "time-material" ? (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tariffa Oraria (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="65"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ore Stimate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="800"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                name="fixedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Fisso (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="15000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="enabledUsers"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Utenti Abilitati
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Seleziona gli utenti che possono registrare ore su questa
                      commessa.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {users.map((user) => (
                      <FormField
                        key={user.id}
                        control={form.control}
                        name="enabledUsers"
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
                                {user.name} {user.surname}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
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
