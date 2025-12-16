"use client";

import type { SaturationEmployee } from "@/app/server-actions/saturation/fetchSaturationData";
import SaturationHeader from "@/components/saturation/saturation-header";
import SaturationProjections from "@/components/saturation/saturation-projections";
import SaturationSummary from "@/components/saturation/saturation-summary";
import SaturationTimeline from "@/components/saturation/saturation-timeline";
import { useState } from "react";

type SaturationPageClientProps = {
  initialEmployees: SaturationEmployee[];
};

export function SaturationPageClient({ initialEmployees }: SaturationPageClientProps) {
  const [currentView, setCurrentView] = useState<"summary" | "timeline" | "projections">("summary");
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
  const [groupBy, setGroupBy] = useState<"team" | "seniority" | null>(null);

  return (
    <div className="space-y-6">
      <SaturationHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        showIssuesOnly={showIssuesOnly}
        onShowIssuesOnlyChange={setShowIssuesOnly}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
      />

      {currentView === "summary" && (
        <SaturationSummary
          employees={initialEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
        />
      )}

      {currentView === "timeline" && (
        <SaturationTimeline
          employees={initialEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
        />
      )}

      {currentView === "projections" && (
        <SaturationProjections
          employees={initialEmployees}
          groupBy={groupBy}
          showIssuesOnly={showIssuesOnly}
        />
      )}
    </div>
  );
}
