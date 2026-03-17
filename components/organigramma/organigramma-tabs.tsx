"use client";

import type { OrgUser } from "@/app/server-actions/organigramma/fetchOrgUsers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getBusinessUnits,
  getSubOrganizations,
  transformUsersToAreaFlow,
  transformUsersToMainFlow,
  transformUsersToSubOrgFlow,
} from "@/lib/organigramma/transform-db-data";
import type { Edge, Node } from "@xyflow/react";
import { useMemo } from "react";
import { OrganigrammaFlow } from "./organigramma-flow";

type OrganigrammaTabsProps = {
  users: OrgUser[];
};

export const OrganigrammaTabs = ({ users }: OrganigrammaTabsProps) => {
  const mainFlow = useMemo(() => transformUsersToMainFlow(users), [users]);
  const subOrgs = useMemo(() => getSubOrganizations(users), [users]);

  const allFlows = useMemo(() => {
    const flows: Array<{
      id: string;
      title: string;
      nodes: Node[];
      edges: Edge[];
    }> = [];

    for (const subOrg of subOrgs) {
      if (subOrg.isMarcoVeronese) {
        const businessUnits = getBusinessUnits(subOrg.user, users);
        for (const bu of businessUnits) {
          const flow = transformUsersToAreaFlow(users, subOrg.user, bu.area);
          flows.push({
            id: bu.title.toLowerCase().replace(/\s+/g, "-").replace(/>/g, ""),
            title: bu.title,
            nodes: flow.nodes,
            edges: flow.edges,
          });
        }
      } else {
        const flow = transformUsersToSubOrgFlow(users, subOrg.user.id);
        flows.push({
          id: subOrg.title.toLowerCase().replace(/\s+/g, "-"),
          title: subOrg.title,
          nodes: flow.nodes,
          edges: flow.edges,
        });
      }
    }

    return flows;
  }, [subOrgs, users]);

  return (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className="grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 h-auto">
        <TabsTrigger value="main" className="transition-all duration-300">
          Panoramica Generale
        </TabsTrigger>
        {allFlows.map((flow) => (
          <TabsTrigger
            key={flow.id}
            value={flow.id}
            className="transition-all duration-300 text-xs sm:text-sm"
          >
            {flow.title.length > 35
              ? `${flow.title.substring(0, 35)}...`
              : flow.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="main" className="mt-6">
        <div className="border rounded-lg bg-background">
          <OrganigrammaFlow
            key="main-flow"
            nodes={mainFlow.nodes}
            edges={mainFlow.edges}
          />
        </div>
      </TabsContent>
      {allFlows.map((flow) => (
        <TabsContent key={flow.id} value={flow.id} className="mt-6">
          <div className="border rounded-lg bg-background">
            <OrganigrammaFlow
              key={`flow-${flow.id}`}
              nodes={flow.nodes}
              edges={flow.edges}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
