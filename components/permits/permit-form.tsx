"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { PermitType, type user } from "@/db";
import { useApi } from "@/hooks/useApi";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DatePicker } from "../custom/DatePicker";

type CreateBulkPermitDTO = Array<{
  type: PermitType;
  date: Date;
  duration: number;
  description: string;
  reviewer_id: string;
}>;

interface PermitFormValues {
  type: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  description: string;
}

interface PermitRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPermitCreated?: () => void;
}

export default function PermitRequestForm({
  open,
  onOpenChange,
  onPermitCreated,
}: PermitRequestFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const { data: reviewers, loading: reviewersLoading, callApi: fetchReviewers } = useApi<user[]>();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<PermitFormValues>({
    defaultValues: {
      type: "",
      startDate: undefined,
      endDate: undefined,
      duration: "",
      description: "",
    },
  });

  const prepareMultiplePermits = (data: PermitFormValues): CreateBulkPermitDTO => {
    const permits: CreateBulkPermitDTO = [];
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (!reviewers || !Array.isArray(reviewers) || reviewers.length === 0) {
      throw new Error("Nessun referente disponibile. Riprova più tardi.");
    }

    if (data.type === PermitType.PERMISSION) {
      reviewers.forEach((reviewer: user) => {
        permits.push({
          type: data.type as PermitType,
          date: startDate,
          duration: parseFloat(data.duration),
          description: data.description,
          reviewer_id: reviewer.id,
        });
      });
    } else {
      if (endDate && endDate > startDate) {
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

        for (let i = 1; i <= days + 1; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          reviewers.forEach((reviewer: user) => {
            permits.push({
              type: data.type as PermitType,
              date: currentDate,
              duration: 8,
              description: data.description,
              reviewer_id: reviewer.id,
            });
          });
        }
      }
    }

    return permits;
  };

  const onSubmit = async (data: PermitFormValues) => {
    setErrorMessage("");

    try {
      const permits = prepareMultiplePermits(data);
      const result = await fetchReviewers("/api/permit/create-bulk-permits", {
        method: "POST",
        body: JSON.stringify(permits),
      });

      if (result) {
        form.reset();
        toast.success("Richiesta inviata con successo!");
        startTransition(() => {
          router.refresh();
        });
        if (onPermitCreated) {
          onPermitCreated();
        }
        onOpenChange(false);
      } else {
        setErrorMessage("Creazione permesso fallita o limite superato (8h).");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Creazione permesso fallita.");
      }
    }
  };

  useEffect(() => {
    fetchReviewers("/api/permit/fetch-user-reviewers");
  }, [fetchReviewers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Richiedi Permesso</DialogTitle>
          <DialogDescription>
            Compila il modulo per richiedere ferie, permessi o segnalare malattia
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "Tipo richiesto" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo di Richiesta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PermitType.VACATION}>Ferie</SelectItem>
                      <SelectItem value={PermitType.PERMISSION}>Permesso</SelectItem>
                      <SelectItem value={PermitType.SICKNESS}>Malattia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              rules={{ required: "Data richiesta" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Data {form.watch("type") !== PermitType.PERMISSION && "Inizio"}
                  </FormLabel>
                  <FormControl>
                    <DatePicker {...field} date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("type") !== PermitType.PERMISSION && (
              <FormField
                control={form.control}
                name="endDate"
                rules={{
                  validate: (value) => {
                    const startDate = form.getValues("startDate");

                    if (value && startDate && new Date(value) < new Date(startDate)) {
                      return "La data di fine non può essere prima della data di inizio";
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fine</FormLabel>
                    <FormControl>
                      <DatePicker {...field} date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("type") === PermitType.PERMISSION && (
              <FormField
                control={form.control}
                rules={{
                  required: "Durata richiesta",
                  validate: (value) => parseFloat(value) > 0 || "Durata deve essere maggiore di 0",
                }}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durata (in ore)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="8"
                        {...field}
                        disabled={form.watch("type") === PermitType.SICKNESS}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <p>
              I tuoi referenti sono:{" "}
              {reviewersLoading
                ? "Caricamento..."
                : reviewers && Array.isArray(reviewers)
                  ? reviewers.map((r: user) => r.name).join(", ")
                  : "Nessun referente disponibile"}
            </p>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivazione</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrivi brevemente il motivo della richiesta"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="transition-all duration-300"
              >
                Annulla
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={
                    isPending || reviewersLoading || !reviewers || !Array.isArray(reviewers)
                  }
                  className="transition-all duration-300"
                >
                  {isPending ? "Invio in corso..." : "Invia Richiesta"}
                </Button>
              </motion.div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
