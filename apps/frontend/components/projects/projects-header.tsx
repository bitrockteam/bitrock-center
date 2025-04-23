"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import AddProjectDialog from "./add-project-dialog";
import { useSessionContext } from "@/app/utenti/SessionData";

export default function ProjectsHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const searchParams = new URLSearchParams(window?.location?.search);
  const [textSearch, setTextSearch] = useState(
    searchParams.get("params") ?? "",
  );
  const [debouncedInput, setDebouncedInput] = useState("");

  const { refetchProjects } = useSessionContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(e.target.value);

    if (e.target.value === "") {
      searchParams.delete("params");
      history.pushState(
        {},
        "",
        `${window.location.pathname}?${searchParams.toString()}`,
      );
      refetchProjects();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedInput(textSearch);
    }, 300);
    return () => clearTimeout(timeout);
  }, [textSearch]);

  useEffect(() => {
    if (debouncedInput !== "") {
      searchParams.set("params", debouncedInput);
      history.pushState(
        {},
        "",
        `${window.location.pathname}?${searchParams.toString()}`,
      );
      refetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput, refetchProjects]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progetti</h1>
        <p className="text-muted-foreground">Gestisci i progetti aziendali</p>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca progetti..."
            className="w-full pl-8 sm:w-[300px]"
            value={textSearch}
            onChange={handleChange}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuovo Progetto
          </Button>
        </motion.div>
      </div>

      <AddProjectDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </motion.div>
  );
}
