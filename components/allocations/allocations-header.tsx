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
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Allocazioni</h1>
        <p className="text-muted-foreground">Gestisci le allocazioni degli utenti alle commesse</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Input
          placeholder="Cerca per utente, cliente o commessa..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Filtra Percentuale</span>
              <span className="sm:hidden">Filtra</span>
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
        <Button onClick={onAddClick} size="default" className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nuova Allocazione</span>
          <span className="sm:hidden">Nuova</span>
        </Button>
      </div>
    </div>
  );
}
