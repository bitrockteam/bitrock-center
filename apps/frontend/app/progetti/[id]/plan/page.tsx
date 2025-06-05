import ProjectPlan from "@/components/projects/project-plan";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Piano di Progetto | Bitrock Hours",
  description: "Visualizza il piano di progetto e il diagramma di Gantt",
};

export default function ProjectPlanPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <ProjectPlan id={params.id} />
    </div>
  );
}
