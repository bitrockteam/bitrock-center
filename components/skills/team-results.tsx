"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { MatchedEmployee } from "./team-matching-algorithm";
import {
  getAvailabilityLabel,
  getAvailabilityColor,
  getSeniorityLabel,
} from "./team-matching-algorithm";
import { getSeniorityLevelColor, getSkillIcon } from "./utils";
import { getSkillColor } from "./color-palette";
import { formatDisplayName } from "@/services/users/utils";
import { X } from "lucide-react";

type TeamResultsProps = {
  matchedEmployees: MatchedEmployee[];
  selectedEmployees: string[];
  onSelectionChange: (employeeIds: string[]) => void;
  minResources: number;
  maxResources: number;
};

export default function TeamResults({
  matchedEmployees,
  selectedEmployees,
  onSelectionChange,
  minResources,
  maxResources,
}: TeamResultsProps) {
  const handleToggleEmployee = (employeeId: string) => {
    if (selectedEmployees.includes(employeeId)) {
      onSelectionChange(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      if (selectedEmployees.length >= maxResources) {
        alert(`Maximum ${maxResources} resources allowed. Please remove an employee first.`);
        return;
      }
      onSelectionChange([...selectedEmployees, employeeId]);
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    onSelectionChange(selectedEmployees.filter((id) => id !== employeeId));
  };

  const selectedCount = selectedEmployees.length;
  const isValidTeam = selectedCount >= minResources && selectedCount <= maxResources;

  return (
    <div className="space-y-4">
      {/* Team Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Team Composition</CardTitle>
          <CardDescription>
            {selectedCount} of {minResources}-{maxResources} resources selected
            {isValidTeam ? (
              <span className="ml-2 text-green-600">✓ Valid team</span>
            ) : (
              <span className="ml-2 text-amber-600">
                {selectedCount < minResources
                  ? `Need ${minResources - selectedCount} more`
                  : `Remove ${selectedCount - maxResources} employee(s)`}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Selected Employees */}
      {selectedEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedEmployees.map((employeeId) => {
                const employee = matchedEmployees.find((e) => e.id === employeeId);
                if (!employee) return null;

                return (
                  <div
                    key={employeeId}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {employee.avatar_url && <AvatarImage src={employee.avatar_url} />}
                        <AvatarFallback>
                          {formatDisplayName({
                            name: employee.name,
                            initials: true,
                          })}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge
                            variant="outline"
                            className={getAvailabilityColor(employee.availability)}
                          >
                            {getAvailabilityLabel(employee.availability)}
                          </Badge>
                          <span>•</span>
                          <span>Match Score: {employee.matchScore.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEmployee(employeeId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Employees */}
      <Card>
        <CardHeader>
          <CardTitle>Available Employees</CardTitle>
          <CardDescription>
            {matchedEmployees.length} employees matched your criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matchedEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No employees match the specified criteria
              </div>
            ) : (
              matchedEmployees.map((employee) => {
                const isSelected = selectedEmployees.includes(employee.id);
                const canSelect = !isSelected && selectedEmployees.length < maxResources;

                return (
                  <div
                    key={employee.id}
                    className={`rounded-lg border p-4 transition-all ${
                      isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleEmployee(employee.id)}
                        disabled={!canSelect && !isSelected}
                      />
                      <Avatar className="h-12 w-12">
                        {employee.avatar_url && <AvatarImage src={employee.avatar_url} />}
                        <AvatarFallback>
                          {formatDisplayName({
                            name: employee.name,
                            initials: true,
                          })}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant="outline"
                              className={getAvailabilityColor(employee.availability)}
                            >
                              {getAvailabilityLabel(employee.availability)}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Score: {employee.matchScore.toFixed(0)}
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {employee.user_skill.map((us) => {
                            const SkillIcon = getSkillIcon(us.skill.icon);
                            return (
                              <div key={us.skill.id} className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={`text-xs flex items-center gap-1 rounded-r-none border-r-0 ${getSeniorityLevelColor(
                                    us.seniorityLevel
                                  )} text-white border-transparent`}
                                  style={{
                                    borderLeftColor: getSkillColor(
                                      us.skill.color,
                                      us.skill.category
                                    ),
                                    borderLeftWidth: "3px",
                                  }}
                                >
                                  <div
                                    className="h-2.5 w-2.5 rounded-sm flex-shrink-0"
                                    style={{
                                      backgroundColor: getSkillColor(
                                        us.skill.color,
                                        us.skill.category
                                      ),
                                    }}
                                  />
                                  {SkillIcon && <SkillIcon className="h-3 w-3" />}
                                  {us.skill.name}
                                </Badge>
                                <Badge
                                  className={`text-xs rounded-l-none ${getSeniorityLevelColor(
                                    us.seniorityLevel
                                  )} text-white opacity-80`}
                                >
                                  {getSeniorityLabel(us.seniorityLevel)}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>

                        {/* Match Details */}
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>Perfect matches: {employee.perfectMatches}</span>
                          <span>Skill matches: {employee.skillMatches}</span>
                          <span>Avg. Seniority: {employee.averageSeniority.toFixed(1)}</span>
                        </div>

                        {/* Allocation Info */}
                        {employee.allocations.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <div className="font-medium mb-1">Current Allocations:</div>
                            <ul className="list-disc list-inside space-y-1">
                              {employee.allocations.map((alloc) => (
                                <li key={alloc.workItemId}>
                                  {alloc.workItemName}
                                  {alloc.endDate && (
                                    <span className="ml-1">
                                      (ends: {new Date(alloc.endDate).toLocaleDateString()})
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
