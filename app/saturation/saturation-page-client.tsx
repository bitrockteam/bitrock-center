"use client";

import type { SaturationEmployee } from "@/app/server-actions/saturation/fetchSaturationData";
import SaturationHeader from "@/components/saturation/saturation-header";
import SaturationProjections from "@/components/saturation/saturation-projections";
import SaturationSummary from "@/components/saturation/saturation-summary";
import SaturationTimeline from "@/components/saturation/saturation-timeline";
import type { Area } from "@/db";
import { useMemo, useState } from "react";

type SaturationPageClientProps = {
  initialEmployees: SaturationEmployee[];
};

const AREA_OPTIONS = ["FRONT_END", "BACK_END", "OTHER"] as const satisfies readonly Area[];

export function SaturationPageClient({ initialEmployees }: SaturationPageClientProps) {
  const [currentView, setCurrentView] = useState<"summary" | "timeline" | "projections">("summary");
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
  const [groupBy, setGroupBy] = useState<"team" | "seniority" | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([]);

  const filteredEmployees = useMemo(() => {
    if (selectedAreas.length === 0) return initialEmployees;
    const allowedAreas = new Set<Area>(selectedAreas);
    return initialEmployees.filter((employee) => allowedAreas.has(employee.area));
  }, [initialEmployees, selectedAreas]);

  return (
    <div className="space-y-6">
      <SaturationHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        showIssuesOnly={showIssuesOnly}
        onShowIssuesOnlyChange={setShowIssuesOnly}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        areaOptions={AREA_OPTIONS}
        selectedAreas={selectedAreas}
        onSelectedAreasChange={setSelectedAreas}
      />

      {currentView === "summary" && (
        <SaturationSummary
          employees={filteredEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
        />
      )}

      {currentView === "timeline" && (
        <SaturationTimeline
          employees={filteredEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
        />
      )}

      {currentView === "projections" && (
        <SaturationProjections
          employees={filteredEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
        />
      )}
    </div>
  );
}
