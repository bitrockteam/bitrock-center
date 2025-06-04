"use client";

import { useTimesheetAddTimesheet } from "@/api/timesheet/useTimesheetAddTimesheet";
import { useGetProjectsUser } from "@/api/useGetProjectsUser";
import { useAuth } from "@/app/(auth)/AuthProvider";
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
import { timesheet } from "@bitrock/db";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editData?: any;
  defaultDate?: string | null;
  onClose?: () => void;
}

const schema = z.object({
  date: z
    .date()
    .min(
      new Date("2020-01-01"),
      "La data deve essere successiva al 1 gennaio 2020",
    ),
  project_id: z.string(),
  hours: z.number(),
  description: z.string().optional(),
  user_id: z.string().min(1, "L'utente è obbligatorio"),
});

export default function AddHoursDialog({
  open,
  onOpenChange,
  editData,
  defaultDate,
  onClose,
}: AddHoursDialogProps) {
  const { user } = useAuth();
  const { projects } = useGetProjectsUser();
  const { execute: addTimesheet } = useTimesheetAddTimesheet();

  const form = useForm<Partial<timesheet>>({
    defaultValues: {
      date: new Date(),
      hours: 8,
      user_id: user?.id || "",
    },
  });

  // Update form when editing an entry or when a default date is provided
  useEffect(() => {
    if (editData) {
      form.reset({
        date: editData.date,
        project_id: undefined,
        hours: editData.hours.toString(),
        description: editData.description,
      });
    } else if (defaultDate) {
      form.reset({
        ...form.getValues(),
        date: new Date(defaultDate),
      });
    }
  }, [editData, defaultDate, form]);

  const onSubmit = async () => {
    // parse data to ensure it matches the expected type

    const parsedData = schema.safeParse(form.getValues());
    if (!parsedData.success) {
      // Handle validation errors
      console.error("Validation failed", parsedData.error);
      return;
    }

    await addTimesheet({
      timesheet: parsedData.data as timesheet,
    }).then(() => {
      // Here you would normally save the data
      onOpenChange(false);
      form.reset();
      if (onClose) onClose();
    });
  };

  const handleDialogClose = () => {
    onOpenChange(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Modifica Ore" : "Aggiungi Ore"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Modifica le ore lavorate per questo giorno."
              : "Inserisci le ore lavorate per un giorno specifico."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value?.toISOString().substring(0, 10)}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date);
                      }}
                      min="2020-01-01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progetto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un progetto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
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

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ore</FormLabel>
                  <FormControl>
                    <Input type="number" min="0.5" step="0.5" {...field} />
                  </FormControl>
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
                      placeholder="Descrivi brevemente l'attività svolta"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={3}
                      maxLength={500}
                      className="resize-none"
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
                onClick={handleDialogClose}
              >
                Annulla
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="submit">{editData ? "Aggiorna" : "Salva"}</Button>
              </motion.div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
