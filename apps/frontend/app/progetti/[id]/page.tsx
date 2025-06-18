import ProjectDetail from "@/components/projects/project-detail";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
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
  const user = await getUserInfoFromCookie();

  return (
    <div className="space-y-6">
      <ProjectDetail id={id} user={user} />{" "}
    </div>
  );
}
