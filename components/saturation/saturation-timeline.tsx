"use client";

import type { SaturationEmployee } from "@/app/server-actions/saturation/fetchSaturationData";
import GanttChart from "@/components/saturation/gantt-chart";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";

type SaturationTimelineProps = {
  employees: SaturationEmployee[];
  groupBy?: "team" | "seniority" | null;
  showIssuesOnly?: boolean;
};

export default function SaturationTimeline({
  employees,
  groupBy: _groupBy,
  showIssuesOnly = false,
}: SaturationTimelineProps) {
  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (showIssuesOnly) {
      filtered = filtered.filter((emp) => emp.totalAllocation < 50 || emp.totalAllocation > 100);
    }

    // Sort by name for consistent display
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, showIssuesOnly]);

  return (
    <Card className="h-[calc(100vh-300px)] overflow-hidden">
      <GanttChart employees={filteredEmployees} isInteractive={false} />
    </Card>
  );
}
