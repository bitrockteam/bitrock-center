"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDeferredValue, useEffect, useState } from "react";
import AddUserDialog from "./add-user-dialog";
import { useSessionContext } from "@/app/utenti/SessionData";

export default function UsersHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const deferredTextSearch = useDeferredValue(textSearch);

  const { refetch } = useSessionContext();

  useEffect(() => {
    if (deferredTextSearch !== "") {
      const serachParams = new URLSearchParams(window.location.search);
      serachParams.set("params", deferredTextSearch);
      history.pushState(
        {},
        "",
        `${window.location.pathname}?${serachParams.toString()}`,
      );
    } else {
      const serachParams = new URLSearchParams(window.location.search);
      serachParams.delete("params");
      history.pushState(
        {},
        "",
        `${window.location.pathname}?${serachParams.toString()}`,
      );
    }
    refetch();
  }, [deferredTextSearch, refetch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Utenti</h1>
        <p className="text-muted-foreground">Gestisci gli utenti aziendali</p>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca utenti..."
            className="w-full pl-8 sm:w-[300px]"
            value={textSearch}
            onChange={(e) => setTextSearch(e.target.value)}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="cursor-pointer	"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuovo Utente
          </Button>
        </motion.div>
      </div>

      <AddUserDialog
        open={showAddDialog}
        onComplete={(isOpen) => setShowAddDialog(isOpen)}
      />
    </motion.div>
  );
}
