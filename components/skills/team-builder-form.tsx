"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import type { SeniorityLevel } from "@/db";
import type { Skill } from "@/hooks/useSkillsApi";
import { getSkillIcon } from "./utils";

export type TeamRequirement = {
  skillId: string;
  seniorityLevel: SeniorityLevel;
};

export type TeamBuilderFormData = {
  requirements: TeamRequirement[];
  minResources: number;
  maxResources: number;
  minOverallSeniority: SeniorityLevel;
};

type TeamBuilderFormProps = {
  skills: Skill[];
  onSubmit: (data: TeamBuilderFormData) => void;
  loading?: boolean;
};

export default function TeamBuilderForm({
  skills,
  onSubmit,
  loading = false,
}: TeamBuilderFormProps) {
  const [requirements, setRequirements] = useState<TeamRequirement[]>([]);
  const [minResources, setMinResources] = useState<number>(1);
  const [maxResources, setMaxResources] = useState<number>(10);
  const [minOverallSeniority, setMinOverallSeniority] = useState<SeniorityLevel>("junior");

  const handleAddRequirement = () => {
    if (skills.length === 0) return;
    setRequirements([
      ...requirements,
      {
        skillId: skills[0].id,
        seniorityLevel: "junior",
      },
    ]);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleRequirementChange = (
    index: number,
    field: "skillId" | "seniorityLevel",
    value: string
  ) => {
    const updated = [...requirements];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setRequirements(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirements.length === 0) {
      alert("Please add at least one skill requirement");
      return;
    }
    if (minResources > maxResources) {
      alert("Minimum resources cannot be greater than maximum resources");
      return;
    }
    onSubmit({
      requirements,
      minResources,
      maxResources,
      minOverallSeniority,
    });
  };

  const getSelectedSkillIds = () => new Set(requirements.map((r) => r.skillId));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Requirements</CardTitle>
        <CardDescription>
          Define the skills and seniority levels required for your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Skills Requirements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Required Skills & Seniority</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRequirement}
                disabled={skills.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>

            {requirements.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                No skills added. Click "Add Skill" to add requirements.
              </div>
            ) : (
              <div className="space-y-3">
                {requirements.map((req, index) => {
                  const availableSkills = skills.filter(
                    (s) => s.id === req.skillId || !getSelectedSkillIds().has(s.id)
                  );

                  return (
                    <div
                      key={`requirement-${req.skillId}-${index}`}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <Select
                          value={req.skillId}
                          onValueChange={(value) =>
                            handleRequirementChange(index, "skillId", value)
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSkills.map((s) => {
                              const Icon = getSkillIcon(s.icon);
                              return (
                                <SelectItem key={s.id} value={s.id}>
                                  <div className="flex items-center gap-2">
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {s.name}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <Select
                          value={req.seniorityLevel}
                          onValueChange={(value) =>
                            handleRequirementChange(
                              index,
                              "seniorityLevel",
                              value as SeniorityLevel
                            )
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="middle">Middle</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resources Range */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minResources">Minimum Resources</Label>
              <Input
                id="minResources"
                type="number"
                min="1"
                value={minResources}
                onChange={(e) => setMinResources(parseInt(e.target.value, 10) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxResources">Maximum Resources</Label>
              <Input
                id="maxResources"
                type="number"
                min="1"
                value={maxResources}
                onChange={(e) => setMaxResources(parseInt(e.target.value, 10) || 10)}
              />
            </div>
          </div>

          {/* Minimum Overall Seniority */}
          <div className="space-y-2">
            <Label htmlFor="minOverallSeniority">Minimum Overall Seniority</Label>
            <Select
              value={minOverallSeniority}
              onValueChange={(value) => setMinOverallSeniority(value as SeniorityLevel)}
            >
              <SelectTrigger id="minOverallSeniority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="middle">Middle</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating Team..." : "Generate Team"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
