"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getSkillsStats, type SkillsStats } from "@/app/server-actions/skills/getSkillsStats";
import {
  EmployeeSeniorityChart,
  TopSkillsChart,
  SkillsByCategoryChart,
  AverageSkillsChart,
  SeniorityPerSkillChart,
} from "./stats-charts";
import { Filter, X } from "lucide-react";
import type { SkillCategory, SeniorityLevel } from "@/db";

type FilterState = {
  category: SkillCategory | "all";
  seniority: SeniorityLevel | "all";
};

export default function StatsTab() {
  const [stats, setStats] = useState<SkillsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    seniority: "all",
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getSkillsStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const filteredStats = useMemo(() => {
    if (!stats) return null;

    // Apply filters
    const filtered = { ...stats };

    if (filters.category !== "all") {
      filtered.skillsDistribution = filtered.skillsDistribution.filter(
        (s) => s.category === filters.category
      );
      filtered.seniorityDistributionPerSkill = filtered.seniorityDistributionPerSkill.filter(
        (s) => {
          const skill = stats.skillsDistribution.find((sk) => sk.skillId === s.skillId);
          return skill?.category === filters.category;
        }
      );
    }

    if (filters.seniority !== "all") {
      filtered.employeeCountBySeniority = filtered.employeeCountBySeniority.filter(
        (s) => s.seniority === filters.seniority
      );
    }

    return filtered;
  }, [stats, filters]);

  const clearFilters = () => {
    setFilters({ category: "all", seniority: "all" });
  };

  const hasActiveFilters = filters.category !== "all" || filters.seniority !== "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading statistics...</div>
      </div>
    );
  }

  if (!stats || !filteredStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">No data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle>Filters</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-3 w-3" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="category-filter" className="text-sm font-medium">
                Category:
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: value as SkillCategory | "all",
                  }))
                }
              >
                <SelectTrigger id="category-filter" className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="hard">Hard Skills</SelectItem>
                  <SelectItem value="soft">Soft Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="seniority-filter" className="text-sm font-medium">
                Seniority:
              </label>
              <Select
                value={filters.seniority}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    seniority: value as SeniorityLevel | "all",
                  }))
                }
              >
                <SelectTrigger id="seniority-filter" className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ category: "hard", seniority: "all" })}
            >
              Hard Skills Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ category: "soft", seniority: "all" })}
            >
              Soft Skills Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ category: "all", seniority: "senior" })}
            >
              Senior Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-3xl">{stats.totalEmployees}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Skills</CardDescription>
            <CardTitle className="text-3xl">{stats.totalSkills}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Skills per Employee</CardDescription>
            <CardTitle className="text-3xl">{stats.averageSkillsPerEmployee.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Skills by Category</CardDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">Hard: {stats.skillsByCategory.hard}</Badge>
              <Badge variant="outline">Soft: {stats.skillsByCategory.soft}</Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee Distribution by Seniority</CardTitle>
            <CardDescription>
              Distribution of employees based on average seniority level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeSeniorityChart stats={filteredStats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Skills Distribution</CardTitle>
            <CardDescription>Most common skills across employees</CardDescription>
          </CardHeader>
          <CardContent>
            <TopSkillsChart stats={filteredStats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills by Category</CardTitle>
            <CardDescription>Hard vs Soft skills distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillsByCategoryChart stats={filteredStats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Skills per Employee</CardTitle>
            <CardDescription>Overall average number of skills</CardDescription>
          </CardHeader>
          <CardContent>
            <AverageSkillsChart stats={filteredStats} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Seniority Distribution per Skill</CardTitle>
            <CardDescription>Breakdown of seniority levels for top skills</CardDescription>
          </CardHeader>
          <CardContent>
            <SeniorityPerSkillChart stats={filteredStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
