import { fetchAllProjects } from "@/api/server/project/fetchAllProjects";
import ProjectsHeader from "@/components/projects/projects-header";
import ProjectsTable from "@/components/projects/projects-table";
import { allowRoles } from "@/services/users/server.utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progetti | Bitrock Hours",
  description: "Gestione dei progetti aziendali",
};

export default async function ProjectsPage() {
  const projects = await fetchAllProjects();
  const canDealProjects = await allowRoles(["Admin", "Super_Admin"]);
  console.log("Projects:", projects);
  console.log("Can deal projects:", canDealProjects);
  return (
    <div className="space-y-6">
      <ProjectsHeader canDealProjects={canDealProjects} />
      <ProjectsTable projects={projects} />
    </div>
  );
}
