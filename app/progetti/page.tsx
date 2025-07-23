import { fetchAllProjects } from "@/app/server-actions/project/fetchAllProjects";
import ProjectsHeader from "@/components/projects/projects-header";
import ProjectsTable from "@/components/projects/projects-table";
import { hasPermission } from "@/services/users/server.utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Progetti | Bitrock Hours",
  description: "Gestione dei progetti aziendali",
};

export default async function ProjectsPage() {
  const projects = await fetchAllProjects();
  const CAN_CREATE_PROJECT = await hasPermission("CAN_CREATE_PROJECT");
  console.log("Projects:", projects);
  console.log("Can deal projects:", CAN_CREATE_PROJECT);
  return (
    <div className="space-y-6">
      <ProjectsHeader canCreateProject={CAN_CREATE_PROJECT} />
      <ProjectsTable projects={projects} />
    </div>
  );
}
