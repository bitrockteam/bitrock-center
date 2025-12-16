"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AllocationsHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function AllocationsHeader({
  onAddClick,
  searchQuery,
  onSearchChange,
}: AllocationsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Allocazioni</h1>
        <p className="text-muted-foreground">Gestisci le allocazioni degli utenti alle commesse</p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Cerca per utente, cliente o commessa..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64"
        />
        <Button onClick={onAddClick} size="default">
          <Plus className="mr-2 h-4 w-4" />
          Nuova Allocazione
        </Button>
      </div>
    </div>
  );
}
