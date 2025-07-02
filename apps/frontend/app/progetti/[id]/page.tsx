import { fetchAllocationsForProject } from "@/api/server/project/fetchAllocationsForProject";
import { fetchProjectById } from "@/api/server/project/fetchProjectById";
import { findUsers } from "@/api/server/user/findUsers";
import ProjectDetail from "@/components/projects/project-detail";
import { allowRoles } from "@/services/users/server.utils";
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
  const canDealProjects = await allowRoles(["Admin", "Super_Admin"]);
  const canAllocateResources = await allowRoles([
    "Admin",
    "Super_Admin",
    "Key_Client",
  ]);
  const project = await fetchProjectById({ projectId: id });
  const users = await findUsers();
  const allocations = await fetchAllocationsForProject({ projectId: id });
  const canSeeUsersTimesheets = await allowRoles([
    "Admin",
    "Super_Admin",
    "Key_Client",
  ]);

  return (
    <div className="space-y-6">
      <ProjectDetail
        users={users}
        id={id}
        canAllocateResources={canAllocateResources}
        canDealProjects={canDealProjects}
        project={project}
        allocations={allocations}
        canSeeUsersTimesheets={canSeeUsersTimesheets}
      />
    </div>
  );
}
