"use client";

import { createUser } from "@/app/server-actions/user/createUser";
import { FindUserById } from "@/app/server-actions/user/findUserById";
import { findUsers } from "@/app/server-actions/user/findUsers";
import { updateUser } from "@/app/server-actions/user/updateUser";
import { uploadFile } from "@/app/server-actions/user/uploadFile";
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
import { Role, user } from "@/db";
import { useServerAction } from "@/hooks/useServerAction";
import { cn } from "@/lib/utils";
import { getFirstnameAndLastname } from "@/services/users/utils";
import { motion } from "framer-motion";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileUploader } from "../custom/FileUploader";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddUserDialogProps {
  open: boolean;
  onComplete: (
    open: boolean,
    options?: {
      shouldRefetch?: boolean;
    },
  ) => void;
  editData?: FindUserById;
  onRefetch?: () => void;
  user: user;
}

export default function AddUserDialog({
  open,
  onComplete,
  editData,
  user,
}: Readonly<AddUserDialogProps>) {
  const [users, refetchUsers, loadingUsers] = useServerAction(findUsers);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      file: undefined as File | undefined,
      role: Role.Employee as Role,
      referent_id: undefined as string | undefined,
    },
  });

  // Update form when editing a user
  useEffect(() => {
    if (editData) {
      form.reset({
        name: getFirstnameAndLastname(editData.name).firstName,
        surname: getFirstnameAndLastname(editData.name).lastName,
        email: editData.email,
        role: editData.role ?? Role.Employee,
        referent_id: editData.referent_id ?? undefined,
      });
    }
  }, [editData, form]);

  const handleUpdateUser = (avatar_url?: string) =>
    updateUser({
      id: editData!.id,
      name: `${form.getValues().name} ${form.getValues().surname}`,
      ...(avatar_url && { avatar_url }),
      role: form.getValues().role,
      referent_id: form.getValues().referent_id,
    });

  const handleComplete = (open: boolean) => {
    onComplete(open, { shouldRefetch: true });
    form.reset();
    refetchUsers();
  };

  const onSubmit = async () => {
    if (editData) {
      const file = form.getValues().file;
      if (file) {
        const fileFormData = new FormData();
        fileFormData.append("file", file);

        await uploadFile({ file: fileFormData }).then((data) => {
          handleUpdateUser(data.data?.fullPath)
            .then(() => toast.success("Utente aggiornato con successo"))
            .finally(() => {
              handleComplete(false);
            });
        });
      } else {
        console.log({ form: form.getValues() });

        handleUpdateUser()
          .then(() => toast.success("Utente aggiornato con successo"))
          .finally(() => {
            handleComplete(false);
          });
      }
    } else
      await createUser({
        name: `${form.getValues().name} ${form.getValues().surname}`,
        email: form.getValues().email,
        role: form.getValues().role,
        referent_id: form.getValues().referent_id,
      })
        .then(() => toast.success("Utente creato con successo"))
        .finally(() => {
          onComplete(false, { shouldRefetch: true });
          form.reset();
          refetchUsers();
        });
  };

  useEffect(() => {
    if (open) refetchUsers();
  }, [open, refetchUsers]);

  return (
    <Dialog open={open} onOpenChange={onComplete}>
      <DialogContent className="sm:max-w-[600px]">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        disabled={!!editData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stato</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleziona ruolo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(Role).map((s) => (
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
                name="referent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referente</FormLabel>
                    <FormControl>
                      <Popover
                        open={isPopoverOpen}
                        onOpenChange={setIsPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-between"
                            disabled={loadingUsers}
                          >
                            {field.value &&
                            users?.some((u) => u.id === field.value)
                              ? users.find((user) => user.id === field.value)
                                  ?.name
                              : "Seleziona referente..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[270px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Seleziona referente..."
                              className="h-9 pointer-events-auto"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Nessun membro disponibile
                              </CommandEmpty>
                              <CommandGroup>
                                {users
                                  ?.filter((u) => u.id !== editData?.id)
                                  .map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.name}
                                      className="pointer-events-auto"
                                      onSelect={() => {
                                        field.onChange(user.id);
                                        setIsPopoverOpen(false);
                                      }}
                                    >
                                      {user.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          field.value === user.id
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {editData && user?.id === editData.id && (
              <FileUploader onChange={(file) => form.setValue("file", file)} />
            )}

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
                <Button type="submit">
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
