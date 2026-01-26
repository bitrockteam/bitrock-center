"use client";

import type { SaturationEmployee } from "@/app/server-actions/saturation/fetchSaturationData";
import SaturationHeader from "@/components/saturation/saturation-header";
import SaturationProjections from "@/components/saturation/saturation-projections";
import SaturationSummary from "@/components/saturation/saturation-summary";
import SaturationTimeline from "@/components/saturation/saturation-timeline";
import type { Area } from "@/db";
import { useEffect, useMemo, useState } from "react";

type SaturationPageClientProps = {
  initialEmployees: SaturationEmployee[];
};

const AREA_OPTIONS = ["FRONT_END", "BACK_END", "OTHER"] as const satisfies readonly Area[];
const SELECTED_AREAS_STORAGE_KEY = "bitrock-center:saturation:selectedAreas";

export function SaturationPageClient({ initialEmployees }: SaturationPageClientProps) {
  const [currentView, setCurrentView] = useState<"summary" | "timeline" | "projections">("summary");
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
  const [groupBy, setGroupBy] = useState<"team" | "seniority" | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([]);


  useEffect(() => {
    const rawSelectedAreas = localStorage.getItem(SELECTED_AREAS_STORAGE_KEY);

    if (!rawSelectedAreas) return;

    const parsed = JSON.parse(rawSelectedAreas) as unknown;
    console.log(parsed);
    if (!Array.isArray(parsed)) return;

    const allowedAreas = new Set<Area>(AREA_OPTIONS);
    const persistedAreas = parsed
      .filter((area): area is Area => typeof area === "string" && allowedAreas.has(area as Area));

    setSelectedAreas(persistedAreas);
  },[])


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
        onSelectedAreasChange={(areas) => {
          setSelectedAreas(areas);
          localStorage.setItem(SELECTED_AREAS_STORAGE_KEY, JSON.stringify(areas));
        }}
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
