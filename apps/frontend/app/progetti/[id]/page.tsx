import { fetchAllocationsForProject } from "@/api/server/project/fetchAllocationsForProject";
import { fetchProjectById } from "@/api/server/project/fetchProjectById";
import ProjectDetail from "@/components/projects/project-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dettaglio Progetto | Bitrock Hours",
  description: "Visualizza i dettagli del progetto",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const canDealProjects = true; // Replace with actual permission check logic
  const canAllocateResources = true; // Replace with actual permission check logic
  const project = await fetchProjectById({ projectId: id });
  const allocations = await fetchAllocationsForProject({ projectId: id });

  return (
    <div className="space-y-6">
      <ProjectDetail
        id={id}
        canAllocateResources={canAllocateResources}
        canDealProjects={canDealProjects}
        project={project}
        allocations={allocations}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
