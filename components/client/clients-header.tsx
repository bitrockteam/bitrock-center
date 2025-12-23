"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Building2, PlusCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddClientDialog from "./add-client-dialog";

export default function ClientsHeader({
  canCreateClient,
  onSuccess,
}: {
  canCreateClient: boolean;
  onSuccess?: () => void | Promise<void>;
}) {
  const router = useRouter();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleSuccess = async () => {
    router.refresh();
    if (onSuccess) {
      await onSuccess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 shadow-lg">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clienti</h1>
          <p className="text-muted-foreground">Gestisci i clienti aziendali</p>
        </div>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca clienti..."
            className="w-full pl-8 sm:w-[300px]"
          />
        </div>
        {canCreateClient && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setShowAddDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuovo Cliente
            </Button>
          </motion.div>
        )}
      </div>

      <AddClientDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleSuccess}
      />
    </motion.div>
  );
}
