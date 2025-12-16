"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DoubleRangeSlider } from "@/components/ui/double-range-slider";
import { Badge } from "@/components/ui/badge";

interface AllocationsHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  percentageRange: [number, number];
  onPercentageRangeChange: (range: [number, number]) => void;
}

export default function AllocationsHeader({
  onAddClick,
  searchQuery,
  onSearchChange,
  percentageRange,
  onPercentageRangeChange,
}: AllocationsHeaderProps) {
  const isFilterActive = percentageRange[0] > 0 || percentageRange[1] < 100;

  const handleResetFilter = () => {
    onPercentageRangeChange([0, 100]);
  };

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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filtra Percentuale
              {isFilterActive && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  !
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Filtra per Percentuale</h4>
                {isFilterActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilter}
                    className="h-6 px-2 text-xs"
                    aria-label="Rimuovi filtro percentuale"
                    tabIndex={0}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
              <DoubleRangeSlider
                min={0}
                max={100}
                value={percentageRange}
                onValueChange={onPercentageRangeChange}
                step={1}
                label="Range Percentuale"
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button onClick={onAddClick} size="default">
          <Plus className="mr-2 h-4 w-4" />
          Nuova Allocazione
        </Button>
      </div>
    </div>
  );
}
