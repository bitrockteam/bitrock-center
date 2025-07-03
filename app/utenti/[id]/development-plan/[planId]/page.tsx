import { getDevelopmentPlanById } from "@/api/server/development-plan/getDevelopmentPlanById";
import DevelopmentPlanDetail from "@/components/development-plan/development-plan-detail";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dettaglio Piano di Sviluppo | Bitrock Hours",
  description: "Dettaglio del piano di sviluppo",
};

export default async function DevelopmentPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string; planId: string }>;
}) {
  const { planId } = await params;
  const { plan, isLatestPlan } = await getDevelopmentPlanById(planId);
  if (!plan) redirect("not-found");
  return (
    <div className="space-y-6">
      <DevelopmentPlanDetail
        user={plan.user}
        plan={plan}
        isLatestPlan={isLatestPlan}
      />
    </div>
  );
}
