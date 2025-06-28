import DevelopmentPlanDetail from "@/components/development-plan/development-plan-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dettaglio Piano di Sviluppo | Bitrock Hours",
  description: "Dettaglio del piano di sviluppo",
};

export default async function DevelopmentPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string; planId: string }>;
}) {
  const { id, planId } = await params;
  return (
    <div className="space-y-6">
      <DevelopmentPlanDetail userId={id} planId={planId} />
    </div>
  );
}
