"use client";

import type {
  SaturationAllocation,
  SaturationEmployee,
} from "@/app/server-actions/saturation/fetchSaturationData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllocationBadgeColor, hasAllocationIssue } from "@/utils/saturation";
import dayjs from "dayjs";
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Edit,
  TrendingUp,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type SaturationSummaryProps = {
  employees: SaturationEmployee[];
  groupBy?: "team" | "seniority" | null;
  showIssuesOnly?: boolean;
  onEditAllocation?: (employeeId: string, allocation: SaturationAllocation) => void;
  onDeleteAllocation?: (employeeId: string, allocation: SaturationAllocation) => void;
};

type GroupSummary = {
  averageAllocation: number;
  issuesCount: number;
  totalEmployees: number;
  totalActiveAllocations: number;
  earliestEndDate: Date | null;
  latestEndDate: Date | null;
  underAllocatedCount: number;
  overAllocatedCount: number;
};

const calculateGroupSummary = (employees: SaturationEmployee[]): GroupSummary => {
  if (employees.length === 0) {
    return {
      averageAllocation: 0,
      issuesCount: 0,
      totalEmployees: 0,
      totalActiveAllocations: 0,
      earliestEndDate: null,
      latestEndDate: null,
      underAllocatedCount: 0,
      overAllocatedCount: 0,
    };
  }

  const totalAllocation = employees.reduce((sum, emp) => sum + emp.totalAllocation, 0);
  const averageAllocation = Math.round((totalAllocation / employees.length) * 10) / 10;

  const issuesCount = employees.filter(hasAllocationIssue).length;
  const underAllocatedCount = employees.filter((emp) => emp.totalAllocation < 50).length;
  const overAllocatedCount = employees.filter((emp) => emp.totalAllocation > 100).length;

  const totalActiveAllocations = employees.reduce((sum, emp) => sum + emp.allocations.length, 0);

  const endDates = employees
    .map((emp) => emp.latestEndDate)
    .filter((date): date is Date => date !== null);

  const earliestEndDate =
    endDates.length > 0 ? new Date(Math.min(...endDates.map((d) => d.getTime()))) : null;
  const latestEndDate =
    endDates.length > 0 ? new Date(Math.max(...endDates.map((d) => d.getTime()))) : null;

  return {
    averageAllocation,
    issuesCount,
    totalEmployees: employees.length,
    totalActiveAllocations,
    earliestEndDate,
    latestEndDate,
    underAllocatedCount,
    overAllocatedCount,
  };
};

export default function SaturationSummary({
  employees,
  groupBy,
  showIssuesOnly = false,
  onEditAllocation,
  onDeleteAllocation,
}: SaturationSummaryProps) {
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);

  const filteredEmployees = useMemo(() => {
    if (showIssuesOnly) {
      return employees.filter((emp) => emp.totalAllocation < 50);
    }
    return employees;
  }, [employees, showIssuesOnly]);

  const handleToggleExpand = (employeeId: string) => {
    setExpandedEmployeeId(expandedEmployeeId === employeeId ? null : employeeId);
  };

  const formatAllocationDate = (date: Date | null) => {
    if (!date) return "-";
    return dayjs(date).format("DD/MM/YYYY");
  };

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
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    groupEmployees.map((employee) => {
                      const hasIssue = hasAllocationIssue(employee);
                      const isExpanded = expandedEmployeeId === employee.id;
                      return (
                        <React.Fragment key={employee.id}>
                          <TableRow
                            className={`${hasIssue ? "bg-destructive/5" : ""} hover:bg-muted/50`}
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
                                  <div className="text-xs text-muted-foreground">
                                    {employee.email}
                                  </div>
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
                                {hasIssue && <AlertTriangle className="h-4 w-4 text-destructive" />}
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
                            <TableCell>
                              {employee.allocations.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-auto w-auto p-0 hover:bg-transparent"
                                  onClick={() => handleToggleExpand(employee.id)}
                                  aria-label="Espandi/Comprimi dettagli allocazioni"
                                  tabIndex={0}
                                >
                                  <ChevronDown
                                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                  />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                          {isExpanded && employee.allocations.length > 0 && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={7} className="p-0 border-0">
                                <div className="px-4 pb-4 pt-2">
                                  <div className="rounded-md border">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Cliente</TableHead>
                                          <TableHead>Progetto</TableHead>
                                          <TableHead>Commessa</TableHead>
                                          <TableHead>Data Inizio</TableHead>
                                          <TableHead>Data Fine</TableHead>
                                          <TableHead>Percentuale</TableHead>
                                          {(onEditAllocation || onDeleteAllocation) && (
                                            <TableHead className="text-right">Azioni</TableHead>
                                          )}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {employee.allocations.map((allocation) => (
                                          <TableRow key={allocation.work_item_id}>
                                            <TableCell>
                                              <div className="flex flex-col">
                                                <span className="font-medium">
                                                  {allocation.client.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {allocation.client.code}
                                                </span>
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              {allocation.project ? (
                                                <span>{allocation.project.name}</span>
                                              ) : (
                                                <span className="text-muted-foreground">-</span>
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              <Link
                                                href={`/commesse/${allocation.work_item_id}`}
                                                className="text-primary hover:underline"
                                              >
                                                {allocation.work_item_title}
                                              </Link>
                                            </TableCell>
                                            <TableCell>
                                              {formatAllocationDate(allocation.start_date)}
                                            </TableCell>
                                            <TableCell>
                                              {formatAllocationDate(allocation.end_date)}
                                            </TableCell>
                                            <TableCell>
                                              <Badge variant="outline">{allocation.percentage}%</Badge>
                                            </TableCell>
                                            {(onEditAllocation || onDeleteAllocation) && (
                                              <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                  {onEditAllocation && (
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      onClick={() =>
                                                        onEditAllocation(employee.id, allocation)
                                                      }
                                                      aria-label={`Modifica allocazione di ${employee.name}`}
                                                      tabIndex={0}
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                  )}
                                                  {onDeleteAllocation && (
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      onClick={() =>
                                                        onDeleteAllocation(employee.id, allocation)
                                                      }
                                                      aria-label={`Elimina allocazione di ${employee.name}`}
                                                      tabIndex={0}
                                                    >
                                                      <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                  )}
                                                </div>
                                              </TableCell>
                                            )}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                  {groupBy &&
                    groupEmployees.length > 0 &&
                    (() => {
                      const summary = calculateGroupSummary(groupEmployees);
                      return (
                        <TableRow className="bg-muted/30 border-t-2 border-muted-foreground/20">
                          <TableCell colSpan={7} className="py-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-6 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Avg Allocation:
                                  </span>
                                  <Badge
                                    className={`${getAllocationBadgeColor(
                                      summary.averageAllocation
                                    )} text-white`}
                                  >
                                    {summary.averageAllocation}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Employees:
                                  </span>
                                  <span className="text-sm font-semibold">
                                    {summary.totalEmployees}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Active Allocations:
                                  </span>
                                  <span className="text-sm font-semibold">
                                    {summary.totalActiveAllocations}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {summary.issuesCount > 0 && (
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                    <span className="text-sm font-medium text-destructive">
                                      {summary.issuesCount} Issue
                                      {summary.issuesCount !== 1 ? "s" : ""}
                                    </span>
                                    {summary.underAllocatedCount > 0 && (
                                      <Badge variant="outline" className="text-xs">
                                        {summary.underAllocatedCount} Under
                                      </Badge>
                                    )}
                                    {summary.overAllocatedCount > 0 && (
                                      <Badge variant="outline" className="text-xs text-destructive">
                                        {summary.overAllocatedCount} Over
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                {summary.earliestEndDate && summary.latestEndDate && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>
                                      Range: {formatDate(summary.earliestEndDate)} -{" "}
                                      {formatDate(summary.latestEndDate)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })()}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
