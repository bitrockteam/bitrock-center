"use client";

import { FindUsers } from "@/api/server/user/findUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Filter, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { Role } from "../../db";
import AddWorkItemDialog from "./add-work-item-dialog";

interface WorkItemsHeaderProps {
  onClientFilter?: (clientId: string | null) => void;
  allClients: FindUsers[];
  canCreateWorkItem?: boolean;
}

export default function WorkItemsHeader({
  onClientFilter,
  allClients,
  canCreateWorkItem = false,
}: WorkItemsHeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const clients = allClients.filter((u) => u.role === Role.Key_Client);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commesse</h1>
        <p className="text-muted-foreground">
          Gestisci le attività lavorative e commesse
        </p>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca commesse..."
            className="w-full pl-8 sm:w-[200px]"
          />
        </div>
        <Select
          onValueChange={(value) =>
            onClientFilter?.(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtra per cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i clienti</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canCreateWorkItem && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setShowAddDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuova Commessa
            </Button>
          </motion.div>
        )}
      </div>

      <AddWorkItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </motion.div>
  );
}
