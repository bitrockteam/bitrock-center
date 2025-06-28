import DevelopmentPlanOverview from "@/components/development-plan/development-plan-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Piano di Sviluppo | Bitrock Hours",
  description: "Piano di sviluppo del dipendente",
};

export default async function DevelopmentPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <DevelopmentPlanOverview userId={id} />
    </div>
  );
}
