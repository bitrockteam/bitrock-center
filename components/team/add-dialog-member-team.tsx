"use client";

import { motion } from "framer-motion";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTeamApi } from "@/hooks/useTeamApi";
import { cn } from "@/lib/utils";

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
import type { AddMemberFormData } from "./types";

export function AddDialogMemberTeam() {
  const { users, usersLoading, teamMembers, addTeamMember } = useTeamApi();
  const [open, setOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddMemberFormData>({
    defaultValues: {
      userId: "",
    },
  });

  // Filter out users who are already team members
  const availableUsers = users.filter(
    (user) => !teamMembers.some((member) => member.id === user.id)
  );

  const handleSubmit = async (data: AddMemberFormData) => {
    if (!data.userId) {
      toast.error("Seleziona un utente");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addTeamMember(data.userId);

      if (result.success) {
        setOpen(false);
        form.reset();
        toast.success("Membro aggiunto al team con successo");
      } else {
        toast.error(result.error || "Errore nell'aggiunta del membro");
      }
    } catch {
      toast.error("Errore nell'aggiunta del membro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.reset();
    setIsPopoverOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full"
          variant="secondary"
          aria-label="Aggiungi nuovo membro al team"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggiungi nuovo membro al team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Membro</FormLabel>
                    <FormControl>
                      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between"
                            disabled={usersLoading}
                          >
                            {field.value && availableUsers?.some((u) => u.id === field.value)
                              ? availableUsers?.find((user) => user.id === field.value)?.name
                              : "Seleziona membro..."}
                            {usersLoading ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[460px] p-0">
                          <Command>
                            <CommandInput placeholder="Cerca membro..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>
                                {availableUsers.length === 0
                                  ? "Tutti gli utenti sono già nel team"
                                  : "Nessun membro disponibile"}
                              </CommandEmpty>
                              <CommandGroup>
                                {availableUsers?.map((user) => (
                                  <CommandItem
                                    key={user.id}
                                    value={user.name}
                                    onSelect={() => {
                                      field.onChange(user.id);
                                      setIsPopoverOpen(false);
                                    }}
                                  >
                                    {user.name}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        field.value === user.id ? "opacity-100" : "opacity-0"
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
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Annulla
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.watch("userId") || availableUsers.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Aggiungendo...
                      </>
                    ) : (
                      "Aggiungi"
                    )}
                  </Button>
                </motion.div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
