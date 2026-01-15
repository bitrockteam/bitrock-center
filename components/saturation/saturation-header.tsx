"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SaturationHeaderProps = {
  currentView: "summary" | "timeline" | "projections";
  onViewChange: (view: "summary" | "timeline" | "projections") => void;
  showIssuesOnly: boolean;
  onShowIssuesOnlyChange: (value: boolean) => void;
  groupBy: "team" | "seniority" | null;
  onGroupByChange: (value: "team" | "seniority" | null) => void;
};

export default function SaturationHeader({
  currentView,
  onViewChange,
  showIssuesOnly,
  onShowIssuesOnlyChange,
  groupBy,
  onGroupByChange,
}: SaturationHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saturation Dashboard</CardTitle>
        <CardDescription>
          View and manage employee allocation percentages across work items
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          value={currentView}
          onValueChange={(value) => {
            if (value === "summary" || value === "timeline" || value === "projections") {
              onViewChange(value);
            }
          }}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-issues"
              checked={showIssuesOnly}
              onCheckedChange={(checked) => onShowIssuesOnlyChange(checked === true)}
            />
            <Label htmlFor="show-issues" className="text-sm font-normal cursor-pointer">
              Mostra solo allocazioni &lt; 50%
            </Label>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm">Group By:</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={groupBy === "team" ? "default" : "outline"}
                size="sm"
                onClick={() => onGroupByChange(groupBy === "team" ? null : "team")}
              >
                Teams
              </Button>
              <Button
                variant={groupBy === "seniority" ? "default" : "outline"}
                size="sm"
                onClick={() => onGroupByChange(groupBy === "seniority" ? null : "seniority")}
              >
                Seniority
              </Button>
              {groupBy && (
                <Button variant="ghost" size="sm" onClick={() => onGroupByChange(null)}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
