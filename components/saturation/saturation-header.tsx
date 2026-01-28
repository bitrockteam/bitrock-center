"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Area } from "@/db";
import { Filter, Plus } from "lucide-react";

type SaturationHeaderProps = {
  currentView: "summary" | "timeline" | "projections";
  onViewChange: (view: "summary" | "timeline" | "projections") => void;
  showIssuesOnly: boolean;
  onShowIssuesOnlyChange: (value: boolean) => void;
  groupBy: "team" | "seniority" | null;
  onGroupByChange: (value: "team" | "seniority" | null) => void;
  areaOptions: readonly Area[];
  selectedAreas: Area[];
  onSelectedAreasChange: (areas: Area[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddAllocationClick: () => void;
  canAllocate: boolean;
};

export default function SaturationHeader({
  currentView,
  onViewChange,
  showIssuesOnly,
  onShowIssuesOnlyChange,
  groupBy,
  onGroupByChange,
  areaOptions,
  selectedAreas,
  onSelectedAreasChange,
  searchQuery,
  onSearchChange,
  onAddAllocationClick,
  canAllocate,
}: SaturationHeaderProps) {
  const handleToggleArea = (area: Area) => {
    const isSelected = selectedAreas.includes(area);
    if (isSelected) {
      onSelectedAreasChange(selectedAreas.filter((a) => a !== area));
      return;
    }
    onSelectedAreasChange([...selectedAreas, area]);
  };

  const handleClearAreas = () => {
    onSelectedAreasChange([]);
  };

  const formatAreaLabel = (area: Area) => {
    if (area === "FRONT_END") return "Front End";
    if (area === "BACK_END") return "Back End";
    return "Other";
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Saturation Dashboard</CardTitle>
          <CardDescription>
            View and manage employee allocation percentages across work items
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="Cerca per nome utente..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64"
          />
          {canAllocate && (
            <Button onClick={onAddAllocationClick} size="default" className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nuova Allocazione</span>
              <span className="sm:hidden">Nuova</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          value={currentView}
          onValueChange={(value) => {
            if (
              value === "summary" ||
              value === "timeline" ||
              value === "projections"
            ) {
              onViewChange(value);
            }
          }}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-issues"
              checked={showIssuesOnly}
              onCheckedChange={(checked) =>
                onShowIssuesOnlyChange(checked === true)
              }
            />
            <Label
              htmlFor="show-issues"
              className="text-sm font-normal cursor-pointer"
            >
              Mostra solo allocazioni &lt; 50%
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm">Area:</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label="Filtra per area"
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Area
                  {selectedAreas.length > 0 && (
                    <Badge variant="secondary" className="px-2">
                      {selectedAreas.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Filtra utenti per area</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {areaOptions.map((area) => (
                  <DropdownMenuCheckboxItem
                    key={area}
                    checked={selectedAreas.includes(area)}
                    onCheckedChange={() => handleToggleArea(area)}
                  >
                    {formatAreaLabel(area)}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAreas}
                  className="w-full justify-start px-2"
                  aria-label="Rimuovi filtro area"
                >
                  Mostra tutti
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm">Group By:</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={groupBy === "team" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onGroupByChange(groupBy === "team" ? null : "team")
                }
              >
                Teams
              </Button>
              <Button
                variant={groupBy === "seniority" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onGroupByChange(groupBy === "seniority" ? null : "seniority")
                }
              >
                Seniority
              </Button>
              {groupBy && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGroupByChange(null)}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
