"use client";

import { useCreateProject } from "@/api/useCreateProject";
import { useGetStatuses } from "@/api/useGetStatuses";
// import { useGetUsers } from "@/api/useGetUsers";
import { useEditProject } from "@/api/useEditProject";
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
import { Textarea } from "@/components/ui/textarea";
import { IProject, IProjectUpsert } from "@bitrock/types";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addProjectSchema } from "./schema";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: IProject;
  projectId?: string;
}

export default function AddProjectDialog({
  open,
  onOpenChange,
  editData,
  projectId,
}: AddProjectDialogProps) {
  const { statuses } = useGetStatuses();
  const { createProject } = useCreateProject();
  const { editProject } = useEditProject();

  const form = useForm<z.infer<typeof addProjectSchema>>({
    defaultValues: {
      name: "",
      client: "",
      description: "",
      status_id: "planned",
      start_date: new Date().toISOString().split("T")[0],
      // team: [] as string[],
    },
  });

  // Update form when editing a project
  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name,
        client: editData.client,
        description: editData.description,
        status_id: editData.status.id,
        start_date: editData.start_date.toISOString().split("T")[0],
        end_date: editData.end_date?.toISOString().split("T")[0],
        // team: editData.team.map((member: any) => member.id),
      });
    }
  }, [editData, form]);

  const onSubmit = (data: z.infer<typeof addProjectSchema>) => {
    const formattedData: IProjectUpsert = {
      ...data,
      start_date: new Date(data.start_date),
      end_date: data.end_date ? new Date(data.end_date) : undefined,
    };

    if (editData && projectId) {
      editProject(formattedData, projectId)
        .then(() => {
          onOpenChange(false);
          form.reset();
        })
        .catch((error) => {
          console.error("Failed to create project:", error);
        });
      return;
    }
    createProject(formattedData)
      .then(() => {
        onOpenChange(false);
        form.reset();
      })
      .catch((error) => {
        console.error("Failed to create project:", error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Modifica Progetto" : "Nuovo Progetto"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Modifica i dettagli del progetto."
              : "Inserisci i dettagli per creare un nuovo progetto."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Progetto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome del progetto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrizione del progetto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stato</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona stato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem value={s.id} key={s.id}>
                            {s.name}
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
                name="start_date"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fine (opzionale)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="team"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Team di Progetto</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {users?.map((user) => (
                      <FormField
                        key={user.id}
                        control={form.control}
                        name="team"
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
                              <FormLabel className="font-normal">
                                {user.name} ({user.role_id})
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
            /> */}

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
                <Button type="submit">
                  {editData ? "Aggiorna" : "Crea Progetto"}
                </Button>
              </motion.div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
