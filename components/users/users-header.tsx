"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { user } from "@/db";
import { motion } from "framer-motion";
import { PlusCircle, Search, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddUserDialog from "./add-user-dialog";

export default function UsersHeader({
  user,
  canCreateUser,
}: {
  user: user;
  canCreateUser: boolean;
}) {
  const router = useRouter();
  const serachParams = useSearchParams();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [textSearch, setTextSearch] = useState(serachParams.get("params") ?? "");
  const [debouncedInput, setDebouncedInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(e.target.value);

    if (e.target.value === "") {
      router.push(`/utenti`);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInput(textSearch);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [textSearch]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to push the search params to the url
  useEffect(() => {
    if (debouncedInput !== "") {
      const newParams = new URLSearchParams(serachParams.toString());
      newParams.set("params", debouncedInput);
      // Remove other params if needed
      router.push(`/utenti?${newParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utenti</h1>
          <p className="text-muted-foreground">Gestisci gli utenti aziendali</p>
        </div>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca utenti..."
            className="w-full pl-8 sm:w-[300px]"
            value={textSearch}
            onChange={handleChange}
          />
        </div>
        {canCreateUser && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setShowAddDialog(true)} className="cursor-pointer	">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuovo Utente
            </Button>
          </motion.div>
        )}
      </div>

      {showAddDialog && (
        <AddUserDialog
          open={showAddDialog}
          onComplete={(isOpen) => setShowAddDialog(isOpen)}
          user={user}
        />
      )}
    </motion.div>
  );
}
