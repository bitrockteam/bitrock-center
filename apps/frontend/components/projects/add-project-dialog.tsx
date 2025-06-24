"use client";

import { createProject } from "@/api/server/project/createProject";
import { updateProject } from "@/api/server/project/updateProject";
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
import { project, ProjectStatus } from "@bitrock/db";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addProjectSchema } from "./schema";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: project;
  projectId?: string;
}

export default function AddProjectDialog({
  open,
  onOpenChange,
  editData,
  projectId,
}: AddProjectDialogProps) {
  const form = useForm<z.infer<typeof addProjectSchema>>({
    defaultValues: {
      name: "",
      client: "",
      description: "",
      status: ProjectStatus.PLANNED,
      start_date: new Date().toISOString().split("T")[0],
      // team: [] as string[],
    },
  });

  // Update form when editing a project
  useEffect(() => {
    console.log(editData?.start_date);
    if (editData) {
      form.reset({
        name: editData.name,
        client: editData.client,
        description: editData.description ?? undefined,
        status: editData.status,
        start_date: String(editData.start_date).slice(0, 10),
        end_date: editData.end_date
          ? String(editData.end_date).slice(0, 10)
          : "",
        // team: editData.team.map((member: any) => member.id),
      });
    }
  }, [editData, form]);

  const onSubmit = async (data: z.infer<typeof addProjectSchema>) => {
    const formattedData: Omit<project, "id" | "created_at"> = {
      ...data,
      start_date: new Date(data.start_date),
      end_date: data.end_date ? new Date(data.end_date) : null,
      status: data.status as ProjectStatus,
    };

    if (editData && projectId) {
      await updateProject({ id: projectId, ...formattedData })
        .then(() => {
          onOpenChange(false);
          form.reset();
        })
        .catch((error) => {
          console.error("Failed to create project:", error);
        });
      return;
    }
    await createProject(formattedData)
      .then(() => {
        onOpenChange(false);
        form.reset();
      })
      .catch((error) => {
        console.error("Failed to create project:", error);
      });
  };

  if (!open) return null;

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
                name="status"
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
                        {Object.keys(ProjectStatus).map((s) => (
                          <SelectItem value={s} key={s}>
                            {s.replace(/_/g, " ")}
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
