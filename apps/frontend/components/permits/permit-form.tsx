"use client";

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
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { useState } from "react";
import { useCreatePermit } from "@/api/useCreatePermit";
import { useGetUsers } from "@/api/useGetUsers";

interface PermitFormValues {
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  reviewerId: string;
}

export default function PermitRequestForm() {
  const { user } = useAuth();
  const { users } = useGetUsers();
  const { createPermit } = useCreatePermit();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<PermitFormValues>({
    defaultValues: {
      type: "",
      startDate: "",
      endDate: "",
      duration: "",
      description: "",
      reviewerId: "",
    },
  });

  const onSubmit = async (data: PermitFormValues) => {
    setErrorMessage("");

    const payload = {
      userId: user!.id,
      type: data.type,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      duration: data.type === "permits" ? parseFloat(data.duration) : 8,
      description: data.description,
      status: "pending",
      reviewerId: data.reviewerId,
    };

    const result = await createPermit(payload);

    if (result) {
      form.reset();
      alert("Richiesta inviata con successo");
    } else {
      setErrorMessage("Creazione permesso fallita o limite superato (8h).");
    }
  };

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
                        <SelectItem value="vacation">Ferie</SelectItem>
                        <SelectItem value="permission">Permesso</SelectItem>
                        <SelectItem value="sickness">Malattia</SelectItem>
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
                      Data {form.watch("type") !== "permit" && "Inizio"}
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("type") !== "permit" && (
                <FormField
                  control={form.control}
                  name="endDate"
                  rules={{ required: "Data richiesta" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Fine</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("type") === "permit" && (
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
                          disabled={form.watch("type") === "sickness"}
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
                        {users.map((user) => (
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
