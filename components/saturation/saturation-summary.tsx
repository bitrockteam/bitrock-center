"use client";

import type { SaturationEmployee } from "@/app/server-actions/saturation/fetchSaturationData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllocationColor, getAllocationBadgeColor, hasAllocationIssue } from "@/utils/saturation";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

type SaturationSummaryProps = {
  employees: SaturationEmployee[];
  groupBy?: "team" | "seniority" | null;
  showIssuesOnly?: boolean;
};

export default function SaturationSummary({
  employees,
  groupBy,
  showIssuesOnly = false,
}: SaturationSummaryProps) {
  const filteredEmployees = useMemo(() => {
    if (showIssuesOnly) {
      return employees.filter(hasAllocationIssue);
    }
    return employees;
  }, [employees, showIssuesOnly]);

  const groupedData = useMemo(() => {
    if (!groupBy) {
      return { "All Employees": filteredEmployees };
    }

    if (groupBy === "team") {
      const grouped: Record<string, SaturationEmployee[]> = {};
      filteredEmployees.forEach((emp) => {
        const key = emp.team?.name ?? "No Team";
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(emp);
      });
      return grouped;
    }

    if (groupBy === "seniority") {
      const grouped: Record<string, SaturationEmployee[]> = {};
      filteredEmployees.forEach((emp) => {
        const key = emp.seniority
          ? emp.seniority.charAt(0).toUpperCase() + emp.seniority.slice(1)
          : "No Seniority";
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(emp);
      });
      return grouped;
    }

    return { "All Employees": filteredEmployees };
  }, [filteredEmployees, groupBy]);

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-6">
          {Object.entries(groupedData).map(([groupName, groupEmployees]) => (
            <div key={groupName}>
              {groupBy && (
                <div className="px-4 py-2 bg-muted/50 border-b font-medium text-sm">
                  {groupName} ({groupEmployees.length})
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Active Allocations</TableHead>
                    <TableHead>Latest End Date</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Seniority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    groupEmployees.map((employee) => {
                      const hasIssue = hasAllocationIssue(employee);
                      return (
                        <TableRow
                          key={employee.id}
                          className={hasIssue ? "bg-destructive/5" : ""}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                {employee.avatar_url && (
                                  <AvatarImage src={employee.avatar_url} alt={employee.name} />
                                )}
                                <AvatarFallback>
                                  {employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-xs text-muted-foreground">{employee.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${getAllocationBadgeColor(
                                  employee.totalAllocation
                                )} text-white`}
                              >
                                {employee.totalAllocation}%
                              </Badge>
                              {hasIssue && (
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{employee.allocations.length}</TableCell>
                          <TableCell>{formatDate(employee.latestEndDate)}</TableCell>
                          <TableCell>
                            {employee.team ? (
                              <Badge variant="outline">{employee.team.name}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">No Team</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {employee.seniority ? (
                              <Badge variant="secondary">
                                {employee.seniority.charAt(0).toUpperCase() +
                                  employee.seniority.slice(1)}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">No Seniority</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

