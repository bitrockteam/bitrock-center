import type { SaturationEmployee } from "@/app/server-actions/saturation/fetchSaturationData";

export const calculateTotalAllocation = (allocations: Array<{ percentage: number }>): number => {
  return allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
};

export const getAllocationColor = (percentage: number): string => {
  if (percentage < 50) {
    return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950";
  }
  if (percentage <= 80) {
    return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950";
  }
  return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950";
};

export const getAllocationBadgeColor = (percentage: number): string => {
  if (percentage < 50) {
    return "bg-red-500";
  }
  if (percentage <= 80) {
    return "bg-yellow-500";
  }
  if (percentage > 100) {
    return "bg-red-600";
  }
  return "bg-green-500";
};

export const hasAllocationIssue = (employee: SaturationEmployee): boolean => {
  return employee.totalAllocation < 50 || employee.totalAllocation > 100;
};

export type GroupedEmployees = {
  [key: string]: SaturationEmployee[];
};

export const groupByTeam = (employees: SaturationEmployee[]): GroupedEmployees => {
  const grouped: GroupedEmployees = {
    "No Team": [],
  };

  employees.forEach((employee) => {
    const teamKey = employee.team ? employee.team.name : "No Team";
    if (!grouped[teamKey]) {
      grouped[teamKey] = [];
    }
    grouped[teamKey].push(employee);
  });

  return grouped;
};

export const groupBySeniority = (employees: SaturationEmployee[]): GroupedEmployees => {
  const grouped: GroupedEmployees = {
    "No Seniority": [],
  };

  employees.forEach((employee) => {
    const seniorityKey = employee.seniority
      ? employee.seniority.charAt(0).toUpperCase() + employee.seniority.slice(1)
      : "No Seniority";
    if (!grouped[seniorityKey]) {
      grouped[seniorityKey] = [];
    }
    grouped[seniorityKey].push(employee);
  });

  return grouped;
};

export const filterIssues = (employees: SaturationEmployee[]): SaturationEmployee[] => {
  return employees.filter((employee) => employee.totalAllocation < 50);
};
