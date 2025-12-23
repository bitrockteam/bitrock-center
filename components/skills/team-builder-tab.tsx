"use client";

import { useEffect, useState } from "react";
import { getTeamBuilderData } from "@/app/server-actions/skills/getTeamBuilderData";
import type { EmployeeWithAvailability } from "@/app/server-actions/skills/getTeamBuilderData";
import { matchEmployeesToTeam } from "./team-matching-algorithm";
import type { TeamBuilderCriteria } from "./team-matching-algorithm";
import TeamBuilderForm, { type TeamBuilderFormData } from "./team-builder-form";
import TeamResults from "./team-results";
import type { MatchedEmployee } from "./team-matching-algorithm";
import { skillsApi, useSkillsCatalog } from "@/hooks/useSkillsApi";

export default function TeamBuilderTab() {
  const [employees, setEmployees] = useState<EmployeeWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [matchedEmployees, setMatchedEmployees] = useState<MatchedEmployee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [formData, setFormData] = useState<TeamBuilderFormData | null>(null);

  const skillsCatalogApi = useSkillsCatalog();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTeamBuilderData();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching team builder data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    skillsApi.fetchSkillsCatalog(skillsCatalogApi);
  }, [skillsCatalogApi]);

  const handleGenerateTeam = async (data: TeamBuilderFormData) => {
    setGenerating(true);
    setHasGenerated(true);
    setFormData(data);

    try {
      const criteria: TeamBuilderCriteria = {
        requirements: data.requirements,
        minResources: data.minResources,
        maxResources: data.maxResources,
        minOverallSeniority: data.minOverallSeniority,
      };

      const matched = matchEmployeesToTeam(employees, criteria);
      setMatchedEmployees(matched);
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error generating team:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading team builder data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TeamBuilderForm
        skills={skillsCatalogApi.data || []}
        onSubmit={handleGenerateTeam}
        loading={generating}
      />

      {hasGenerated && matchedEmployees.length > 0 && formData && (
        <TeamResults
          matchedEmployees={matchedEmployees}
          selectedEmployees={selectedEmployees}
          onSelectionChange={setSelectedEmployees}
          minResources={formData.minResources}
          maxResources={formData.maxResources}
        />
      )}

      {hasGenerated && matchedEmployees.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No employees match the specified criteria. Try adjusting your requirements.
          </p>
        </div>
      )}
    </div>
  );
}
