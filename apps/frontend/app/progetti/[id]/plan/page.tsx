import ProjectPlan from "@/components/projects/project-plan";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Piano di Progetto | Bitrock Hours",
  description: "Visualizza il piano di progetto e il diagramma di Gantt",
};

export default async function ProjectPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <ProjectPlan id={id} />
    </div>
  );
}
