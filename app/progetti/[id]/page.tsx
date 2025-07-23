import { fetchAllocationsForProject } from "@/app/server-actions/project/fetchAllocationsForProject";
import { fetchProjectById } from "@/app/server-actions/project/fetchProjectById";
import { findUsers } from "@/app/server-actions/user/findUsers";
import ProjectDetail from "@/components/projects/project-detail";
import { hasPermission } from "@/services/users/server.utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
  const CAN_ALLOCATE_RESOURCE = await hasPermission("CAN_ALLOCATE_RESOURCE");
  const CAN_EDIT_PROJECT = await hasPermission("CAN_EDIT_PROJECT");
  const project = await fetchProjectById({ projectId: id });
  const users = await findUsers();
  const allocations = await fetchAllocationsForProject({ projectId: id });
  const CAN_SEE_OTHERS_TIMESHEET = await hasPermission(
    "CAN_SEE_OTHERS_TIMESHEET",
  );

  return (
    <div className="space-y-6">
      <ProjectDetail
        users={users}
        id={id}
        canAllocateResources={CAN_ALLOCATE_RESOURCE}
        canEditProject={CAN_EDIT_PROJECT}
        project={project}
        allocations={allocations}
        canSeeUsersTimesheets={CAN_SEE_OTHERS_TIMESHEET}
      />
    </div>
  );
}
