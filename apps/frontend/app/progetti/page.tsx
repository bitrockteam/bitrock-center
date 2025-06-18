import ProjectsHeader from "@/components/projects/projects-header";
import ProjectsTable from "@/components/projects/projects-table";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progetti | Bitrock Hours",
  description: "Gestione dei progetti aziendali",
};

export default async function ProjectsPage() {
  const user = await getUserInfoFromCookie();
  return (
    <div className="space-y-6">
      <ProjectsHeader user={user} />
      <ProjectsTable />
    </div>
  );
}
