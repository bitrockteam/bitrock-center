"use client";

import { useCreatePermit } from "@/api/useCreatePermit";
import { useGetUsers } from "@/api/useGetUsers";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DatePicker } from "../custom/DatePicker";
// import { useGetPermitsByUser } from "@/api/useGetPermitsByUser";
// import { useGetPermitsByReviewer } from "@/api/useGetPermitsByReviewer";
import { useSessionContext } from "@/app/utenti/SessionData";
import { PermitStatus, PermitType } from "@bitrock/db";
import { Decimal } from "@bitrock/db/generated/prisma/runtime/library";

interface PermitFormValues {
  type: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  description: string;
  reviewerId: string;
}

export default function PermitRequestForm() {
  const { user } = useAuth();
  const { users } = useGetUsers();
  const { createPermit } = useCreatePermit();
  const { refetchPermits } = useSessionContext();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<PermitFormValues>({
    defaultValues: {
      type: "",
      startDate: undefined,
      endDate: undefined,
      duration: "",
      description: "",
      reviewerId: "",
    },
  });

  const onSubmit = (data: PermitFormValues) => {
    setErrorMessage("");

    const payload = {
      userId: user!.id,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      duration:
        data.type === PermitType.PERMISSION ? parseFloat(data.duration) : 8,
      description: data.description,
      status: PermitStatus.PENDING,
      reviewerId: data.reviewerId,
    };

    createPermit({
      user_id: payload.userId,
      type: payload.type as PermitType,
      date: payload.startDate,
      duration: Decimal(payload.duration),
      description: payload.description,
      status: payload.status,
      reviewer_id: payload.reviewerId,
    })
      .then((result) => {
        if (result) {
          form.reset();
          toast.success("Richiesta inviata con successo!");
          refetchPermits();
        } else {
          setErrorMessage("Creazione permesso fallita o limite superato (8h).");
        }
      })
      .catch(() => {
        setErrorMessage("Creazione permesso fallita.");
      });
  };

  console.log(form.watch("type"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Richiedi Permesso</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                rules={{ required: "Tipo richiesto" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo di Richiesta</FormLabel>
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
                        <SelectItem value={PermitType.VACATION}>
                          Ferie
                        </SelectItem>
                        <SelectItem value={PermitType.PERMISSION}>
                          Permesso
                        </SelectItem>
                        <SelectItem value={PermitType.SICKNESS}>
                          Malattia
                        </SelectItem>
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
                      Data{" "}
                      {form.watch("type") !== PermitType.PERMISSION && "Inizio"}
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        date={field.value}
                        setDate={field.onChange}
                      />
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

                      if (
                        value &&
                        startDate &&
                        new Date(value) < new Date(startDate)
                      ) {
                        return "La data di fine non può essere prima della data di inizio";
                      }

                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Fine</FormLabel>
                      <FormControl>
                        <DatePicker
                          {...field}
                          date={field.value}
                          setDate={field.onChange}
                        />
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
                    validate: (value) =>
                      parseFloat(value) > 0 ||
                      "Durata deve essere maggiore di 0",
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

              <FormField
                control={form.control}
                rules={{ required: "Responsabile richiesto" }}
                name="reviewerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsabile</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona Responsabile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users
                          .filter((u) => u.id !== user?.id)
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
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

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <motion.div
                className="pt-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="submit" className="w-full">
                  Invia Richiesta
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
