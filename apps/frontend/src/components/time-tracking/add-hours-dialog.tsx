"use client";

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
import { getProjects } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AddHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editData?: any;
  defaultDate?: string | null;
  onClose?: () => void;
}

export default function AddHoursDialog({
  open,
  onOpenChange,
  editData,
  defaultDate,
  onClose,
}: AddHoursDialogProps) {
  const projects = getProjects();

  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      project: "",
      hours: "",
      description: "",
    },
  });

  // Update form when editing an entry or when a default date is provided
  useEffect(() => {
    if (editData) {
      form.reset({
        date: editData.date,
        project: editData.project,
        hours: editData.hours.toString(),
        description: editData.description,
      });
    } else if (defaultDate) {
      form.reset({
        ...form.getValues(),
        date: defaultDate,
      });
    }
  }, [editData, defaultDate, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data);
    // Here you would normally save the data
    onOpenChange(false);
    form.reset();
    if (onClose) onClose();
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
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project"
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
