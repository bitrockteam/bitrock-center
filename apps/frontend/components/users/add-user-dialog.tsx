"use client";

import { useCreateUser } from "@/api/useCreateUser";
import { useUpdateUser } from "@/api/useUpdateUser";
import { useSessionContext } from "@/app/utenti/SessionData";
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
import { getFirstnameAndLastname } from "@/services/users/utils";
import { IUser } from "@bitrock/types";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onComplete: (
    open: boolean,
    options?: {
      shouldRefetch?: boolean;
    },
  ) => void;
  editData?: IUser;
  onRefetch?: () => void;
}

export default function AddUserDialog({
  open,
  onComplete,
  editData,
}: Readonly<AddUserDialogProps>) {
  const { createUser, isLoading: isLoadingCreateUser } = useCreateUser();
  const { updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();
  const { refetch } = useSessionContext();

  const form = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
    },
  });

  // Update form when editing a user
  useEffect(() => {
    if (editData) {
      form.reset({
        name: getFirstnameAndLastname(editData.name).firstName,
        surname: getFirstnameAndLastname(editData.name).lastName,
        email: editData.email,
      });
    }
  }, [editData, form]);

  const onSubmit = () => {
    if (editData) {
      updateUser({
        id: editData.id,
        user: { name: `${form.getValues().name} ${form.getValues().surname}` },
      })
        .then(() => toast.success("Utente aggiornato con successo"))
        .finally(() => {
          onComplete(false, { shouldRefetch: true });
          form.reset();
          refetch();
        });
    } else
      createUser({
        user: {
          name: `${form.getValues().name} ${form.getValues().surname}`,
          email: form.getValues().email,
        },
      })
        .then(() => toast.success("Utente creato con successo"))
        .finally(() => {
          onComplete(false, { shouldRefetch: true });
          form.reset();
          refetch();
        });
  };

  return (
    <Dialog open={open} onOpenChange={onComplete}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Modifica Utente" : "Nuovo Utente"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Modifica i dettagli dell'utente."
              : "Inserisci i dettagli per creare un nuovo utente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cognome</FormLabel>
                    <FormControl>
                      <Input placeholder="Cognome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@bitrock.it"
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
                onClick={() => onComplete(false)}
              >
                Annulla
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  disabled={isLoadingUpdateUser || isLoadingCreateUser}
                >
                  {isLoadingUpdateUser || (isLoadingCreateUser && <Loader2 />)}
                  {editData ? "Aggiorna" : "Crea Utente"}
                </Button>
              </motion.div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
