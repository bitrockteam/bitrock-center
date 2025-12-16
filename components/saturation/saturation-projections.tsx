"use client";

import type { SaturationEmployee } from "@/app/server-actions/saturation/fetchSaturationData";
import GanttChart from "@/components/saturation/gantt-chart";
import ProjectionDialog from "@/components/saturation/projection-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/hooks/useApi";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Projection = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  created_by: string;
  creator_name: string;
  is_active: boolean;
  allocations: Array<{
    id: string;
    user_id: string;
    user_name: string;
    work_item_id: string | null;
    work_item_title: string | null;
    start_date: Date;
    end_date: Date | null;
    percentage: number;
  }>;
};

type SaturationProjectionsProps = {
  employees: SaturationEmployee[];
  groupBy?: "team" | "seniority" | null;
  showIssuesOnly?: boolean;
};

export default function SaturationProjections({
  employees,
  groupBy,
  showIssuesOnly = false,
}: SaturationProjectionsProps) {
  const { callApi } = useApi();
  const [projections, setProjections] = useState<Projection[]>([]);
  const [selectedProjectionId, setSelectedProjectionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCells, setSelectedCells] = useState<
    Map<string, { date: Date; percentage: number }[]>
  >(new Map());

  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (showIssuesOnly) {
      filtered = filtered.filter((emp) => emp.totalAllocation < 50 || emp.totalAllocation > 100);
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, showIssuesOnly]);

  const selectedProjection = useMemo(() => {
    return projections.find((p) => p.id === selectedProjectionId) ?? null;
  }, [projections, selectedProjectionId]);

  const projectionAllocations = useMemo(() => {
    if (!selectedProjection) return [];
    return selectedProjection.allocations.map((alloc) => ({
      user_id: alloc.user_id,
      start_date: new Date(alloc.start_date),
      end_date: alloc.end_date ? new Date(alloc.end_date) : null,
      percentage: alloc.percentage,
      work_item_title: alloc.work_item_title,
    }));
  }, [selectedProjection]);

  const loadProjections = useCallback(async () => {
    try {
      const response = await callApi("/api/saturation/projections", {
        method: "GET",
      });
      if (response.success && response.data) {
        setProjections(response.data);
        if (response.data.length > 0 && !selectedProjectionId) {
          setSelectedProjectionId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load projections:", error);
    }
  }, [callApi, selectedProjectionId]);

  useEffect(() => {
    loadProjections();
  }, [loadProjections]);

  const handleCreateProjection = async (name: string, description?: string) => {
    try {
      const response = await callApi("/api/saturation/projections", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });
      if (response.success) {
        await loadProjections();
        if (response.data?.id) {
          setSelectedProjectionId(response.data.id);
        }
      }
    } catch (error) {
      console.error("Failed to create projection:", error);
    }
  };

  const handleDeleteProjection = async (projectionId: string) => {
    if (!confirm("Are you sure you want to delete this projection?")) {
      return;
    }
    try {
      const response = await callApi(`/api/saturation/projections/${projectionId}`, {
        method: "DELETE",
      });
      if (response.success) {
        await loadProjections();
        if (selectedProjectionId === projectionId) {
          setSelectedProjectionId(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete projection:", error);
    }
  };

  const handleCellClick = useCallback(
    (employeeId: string, date: Date) => {
      if (!selectedProjectionId) {
        alert("Please select or create a projection first");
        return;
      }

      setSelectedCells((prev) => {
        const newMap = new Map(prev);
        const key = `${employeeId}-${selectedProjectionId}`;
        const existing = newMap.get(key) ?? [];
        const cellKey = date.toISOString().split("T")[0];
        const index = existing.findIndex(
          (c) => c.date.toISOString().split("T")[0] === cellKey
        );

        if (index >= 0) {
          // Remove if already selected
          existing.splice(index, 1);
        } else {
          // Add with default 100% allocation
          existing.push({ date, percentage: 100 });
        }

        if (existing.length === 0) {
          newMap.delete(key);
        } else {
          newMap.set(key, existing);
        }

        return newMap;
      });
    },
    [selectedProjectionId]
  );

  const handleSaveAllocations = async () => {
    if (!selectedProjectionId) return;

    const allocations: Array<{
      user_id: string;
      start_date: Date;
      end_date: Date | null;
      percentage: number;
    }> = [];

    selectedCells.forEach((cells, key) => {
      const [employeeId] = key.split("-");
      cells.forEach((cell) => {
        allocations.push({
          user_id: employeeId,
          start_date: cell.date,
          end_date: null, // Single day allocation
          percentage: cell.percentage,
        });
      });
    });

    try {
      const response = await callApi(`/api/saturation/projections/${selectedProjectionId}/allocations`, {
        method: "POST",
        body: JSON.stringify({ allocations }),
      });
      if (response.success) {
        await loadProjections();
        setSelectedCells(new Map());
        alert("Projection allocations saved successfully");
      }
    } catch (error) {
      console.error("Failed to save allocations:", error);
      alert("Failed to save allocations");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Select
              value={selectedProjectionId ?? ""}
              onValueChange={setSelectedProjectionId}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a projection" />
              </SelectTrigger>
              <SelectContent>
                {projections.length === 0 ? (
                  <SelectItem value="no-projections" disabled>
                    No projections available
                  </SelectItem>
                ) : (
                  projections.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedProjection && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteProjection(selectedProjection.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)}>New Projection</Button>
            {selectedProjectionId && (
              <Button onClick={handleSaveAllocations} variant="default">
                Save Allocations
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="h-[calc(100vh-400px)] overflow-hidden">
        <GanttChart
          employees={filteredEmployees}
          isInteractive={true}
          onCellClick={handleCellClick}
          projectionAllocations={projectionAllocations}
        />
      </Card>

      <ProjectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleCreateProjection}
      />
    </div>
  );
}

