"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateAllocation } from "@/api/useCreateAllocation";
import { useGetProjectsUsersAvailable } from "@/api/useGetProjectsUsersAvailable";
import { useSessionContext } from "@/app/utenti/SessionData";
import { format } from "date-fns";
import { DatePicker } from "../custom/DatePicker";
import { Loader } from "../custom/Loader";
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
import { useUpdateAllocation } from "@/api/useUpdateAllocation";

export function AddProjectMemberDialog({
  open,
  onOpenChange,
  projectId,
  refetch,
  isEdit,
  initialData,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  refetch: () => void;
  isEdit: boolean;
  initialData?: {
    user_id: string;
    start_date?: Date;
    end_date?: Date;
    percentage?: number;
  };
}>) {
  const { users } = useSessionContext();
  const { users: usersAvailable, isLoading } =
    useGetProjectsUsersAvailable(projectId);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { createAllocation } = useCreateAllocation();
  const { updateAllocation } = useUpdateAllocation();

  const form = useForm<z.infer<typeof addMemberProjectSchema>>({
    defaultValues: {
      user_id: "",
      end_date: undefined,
      percentage: 100,
      start_date: undefined,
    },
  });

  const getUsers = () => {
    return isEdit ? users : usersAvailable;
  };

  useEffect(() => {
    if (isEdit && initialData) {
      form.reset({
        user_id: initialData.user_id,
        start_date: initialData.start_date ?? undefined,
        end_date: initialData.end_date ?? undefined,
        percentage: initialData.percentage ?? 100,
      });
    }
  }, [form, initialData, isEdit, usersAvailable]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{"Aggiungi membro al progetto"}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit(() => {
                    const values = form.getValues();
                    if (isEdit) {
                      updateAllocation(projectId, values.user_id, {
                        start_date: values.start_date
                          ? format(values.start_date, "yyyy-MM-dd")
                          : undefined,
                        end_date: values.end_date
                          ? format(values.end_date, "yyyy-MM-dd")
                          : undefined,
                        percentage: values.percentage ?? 100,
                      }).then(() => {
                        onOpenChange(false);
                        form.reset();
                        refetch();
                      });
                    } else
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
                                  disabled={isEdit}
                                >
                                  {field.value &&
                                  getUsers().some((u) => u.id === field.value)
                                    ? getUsers().find(
                                        (user) => user.id === field.value,
                                      )?.name
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
                                    <CommandEmpty>
                                      Nessun membro disponibile
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {getUsers().map((user) => (
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
                              autoFocus={false}
                              type="number"
                              className="w-[250px]"
                              {...field}
                              onChange={(e) => {
                                if (Number(e.target.value) > 100)
                                  field.onChange(100);
                                else if (Number(e.target.value) < 5)
                                  field.onChange(5);
                                else field.onChange(Number(e.target.value));
                              }}
                              max={100}
                              min={5}
                              step={5}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
