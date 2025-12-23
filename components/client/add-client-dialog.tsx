"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/app/server-actions/client/createClient";
import type { FindClientByIdResponse } from "@/app/server-actions/client/findClientById";
import { updateClient } from "@/app/server-actions/client/updateClient";
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

const clientSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  code: z
    .string()
    .min(1, "Il codice è obbligatorio")
    .max(10, "Il codice deve essere massimo 10 caratteri"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(1, "Il telefono è obbligatorio"),
  address: z.string().min(1, "L'indirizzo è obbligatorio"),
  vatNumber: z.string().min(1, "La partita IVA è obbligatoria"),
  contactPerson: z.string().min(1, "La persona di contatto è obbligatoria"),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: FindClientByIdResponse;
  onSuccess?: () => void | Promise<void>;
}

export default function AddClientDialog({
  open,
  onOpenChange,
  editData,
  onSuccess,
}: AddClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editData;

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: editData?.name || "",
      code: editData?.code || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
      address: editData?.address || "",
      vatNumber: editData?.vat_number || "",
      contactPerson: editData?.contact_person || "",
      status: editData?.status || "active",
      notes: editData?.notes || "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name || "",
        code: editData.code || "",
        email: editData.email || "",
        phone: editData.phone || "",
        address: editData.address || "",
        vatNumber: editData.vat_number || "",
        contactPerson: editData.contact_person || "",
        status: editData.status || "active",
        notes: editData.notes || "",
      });
    } else {
      form.reset({
        name: "",
        code: "",
        email: "",
        phone: "",
        address: "",
        vatNumber: "",
        contactPerson: "",
        status: "active",
        notes: "",
      });
    }
  }, [editData, form]);

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateClient(editData.id, {
          name: data.name,
          code: data.code,
          email: data.email,
          phone: data.phone,
          address: data.address,
          vat_number: data.vatNumber,
          contact_person: data.contactPerson,
          status: data.status,
          notes: data.notes || "",
        });
      } else {
        await createClient({
          name: data.name,
          code: data.code,
          email: data.email,
          phone: data.phone,
          address: data.address,
          vat_number: data.vatNumber,
          contact_person: data.contactPerson,
          status: data.status,
          notes: data.notes || "",
        });
      }
      onOpenChange(false);
      form.reset();
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifica Cliente" : "Nuovo Cliente"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica i dati del cliente esistente."
              : "Inserisci i dati per creare un nuovo cliente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codice</FormLabel>
                    <FormControl>
                      <Input placeholder="ACME" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@acme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input placeholder="+39 02 1234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indirizzo</FormLabel>
                  <FormControl>
                    <Input placeholder="Via Milano 123, 20100 Milano" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partita IVA</FormLabel>
                    <FormControl>
                      <Input placeholder="IT12345678901" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persona di Contatto</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario Rossi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stato</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona lo stato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Attivo</SelectItem>
                      <SelectItem value="inactive">Inattivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Note aggiuntive sul cliente..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annulla
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Salva Modifiche" : "Crea Cliente"}
                </Button>
              </motion.div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
