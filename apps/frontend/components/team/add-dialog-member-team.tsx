"use client";

import { findUsers } from "@/api/server/user/findUsers";
import { motion } from "framer-motion";
import { useServerAction } from "@/hooks/useServerAction";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { addUserToTeam } from "@/api/server/user/addUserToTeam";
import { toast } from "sonner";

export function AddDialogMemberTeam() {
  const [users, fetchUsers] = useServerAction(findUsers);
  const [open, setOpen] = useState(false);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      user_id: "",
    },
  });

  const onSubmit = () => {
    addUserToTeam(form.getValues("user_id"))
      .then(() => {
        setOpen(false);
        form.reset();
        toast.success("Membro aggiunto al team con successo");
      })
      .catch(() => {
        toast.error(`Errore nell'aggiunta del membro`);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="submit" className="w-full" variant="secondary">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggiungi nuovo membro al team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Membro</FormLabel>
                    <FormControl>
                      <Popover
                        open={isPopoverOpen}
                        onOpenChange={setIsPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between"
                          >
                            {field.value &&
                            users?.some((u) => u.id === field.value)
                              ? users?.find((user) => user.id === field.value)
                                  ?.name
                              : "Seleziona membro..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[460px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Seleziona membro..."
                              className="h-9 pointer-events-auto"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Nessun membro disponibile
                              </CommandEmpty>
                              <CommandGroup>
                                {users?.map((user) => (
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
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Annulla
                </Button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button type="submit">Aggiungi</Button>
                </motion.div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
