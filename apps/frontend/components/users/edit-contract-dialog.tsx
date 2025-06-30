"use client";

import { updateEmployeeContract } from "@/api/server/contract/updateEmployeeContract";
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
import {
  contract,
  contracttype,
  remotepolicy,
  workinghours,
} from "@bitrock/db";
import { motion } from "framer-motion";
import { Building, Clock, DollarSign, FileText, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: contract;
  employeeId: string;
}

export default function EditContractDialog({
  open,
  onOpenChange,
  contract,
  employeeId,
}: EditContractDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      ral: contract?.ral || 0,
      contract_type: contract?.contract_type || "permanent",
      working_hours: contract?.working_hours || "full-time",
      remote_policy: contract?.remote_policy || "hybrid",
      notes: contract?.notes || "",
    },
  });

  useEffect(() => {
    if (contract) {
      form.reset({
        ral: contract.ral,
        contract_type: contract.contract_type,
        working_hours: contract.working_hours,
        remote_policy: contract.remote_policy,
        notes: contract.notes ?? "",
      });
    }
  }, [contract, form]);

  const onSubmit = async (data: {
    ral: number;
    contract_type: contracttype;
    working_hours: workinghours;
    remote_policy: remotepolicy;
    notes: string;
  }) => {
    setIsLoading(true);
    try {
      await updateEmployeeContract(employeeId, {
        id: contract.id, // Ensure to pass the contract ID
        ral: data.ral,
        contract_type: data.contract_type,
        working_hours: data.working_hours,
        remote_policy: data.remote_policy,
        notes: data.notes,
      });

      onOpenChange(false);
      // In a real app, you'd trigger a refetch or update the UI
    } catch (error) {
      console.error("Error updating contract:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Modifica Contratto
          </DialogTitle>
          <DialogDescription>
            Aggiorna le informazioni contrattuali del dipendente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* RAL */}
            <FormField
              control={form.control}
              name="ral"
              rules={{
                required: "Il RAL è obbligatorio",
                min: { value: 1, message: "Il RAL deve essere maggiore di 0" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    RAL Annuale (€)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="45000"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contract Type */}
              <FormField
                control={form.control}
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Tipo Contratto
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona tipo contratto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="permanent">
                          Tempo Indeterminato
                        </SelectItem>
                        <SelectItem value="fixed-term">
                          Tempo Determinato
                        </SelectItem>
                        <SelectItem value="freelancer">Freelancer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Working Hours */}
              <FormField
                control={form.control}
                name="working_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Orario di Lavoro
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona orario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="custom">Personalizzato</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Remote Policy */}
            <FormField
              control={form.control}
              name="remote_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Modalità di Lavoro
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona modalità" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-remote">Full Remote</SelectItem>
                      <SelectItem value="hybrid">Ibrido</SelectItem>
                      <SelectItem value="on-site">In Sede</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Aggiuntive</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Inserisci note aggiuntive sul contratto..."
                      className="min-h-[100px] resize-none"
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
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annulla
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvataggio..." : "Salva Modifiche"}
                </Button>
              </motion.div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
