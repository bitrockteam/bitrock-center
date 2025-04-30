"use client";

import { useSessionContext } from "@/app/utenti/SessionData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateAllocation } from "@/api/useCreateAllocation";
import { format } from "date-fns";
import { DatePicker } from "../custom/DatePicker";
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
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { addMemberProjectSchema } from "./schema";

export function AddProjectMemberDialog({
  open,
  onOpenChange,
  projectId,
  refetch,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  refetch: () => void;
}>) {
  const { users } = useSessionContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { createAllocation } = useCreateAllocation();

  const form = useForm<z.infer<typeof addMemberProjectSchema>>({
    defaultValues: {
      user_id: "",
      end_date: undefined,
      percentage: 100,
      start_date: undefined,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{"Aggiungi membro al progetto"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(() => {
                const values = form.getValues();

                createAllocation({
                  project_id: projectId,
                  start_date: values.start_date
                    ? format(values.start_date, "yyyy-MM-dd")
                    : undefined,
                  end_date: values.end_date
                    ? format(values.end_date, "yyyy-MM-dd")
                    : undefined,
                  percentage: values.percentage,
                  user_id: values.user_id,
                }).then(() => {
                  onOpenChange(false);
                  form.reset();
                  refetch();
                });
              })(e);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
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
                              aria-expanded={open}
                              className="w-[250px] justify-between"
                            >
                              {field.value
                                ? users.find((user) => user.id === field.value)
                                    ?.name
                                : "Seleziona membro..."}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Seleziona membro..."
                                className="h-9 pointer-events-auto"
                              />
                              <CommandList>
                                <CommandEmpty>No framework found.</CommandEmpty>
                                <CommandGroup>
                                  {users.map((user) => (
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

              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentuale allocazione</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome del cliente"
                          type="number"
                          className="w-[250px]"
                          {...field}
                          onChange={(e) => {
                            if (Number(e.target.value) > 100)
                              field.onChange(100);
                            else field.onChange(Number(e.target.value));
                          }}
                          max={100}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data inizio</FormLabel>
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
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="end_date"
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
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
