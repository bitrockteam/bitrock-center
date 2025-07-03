import { getEmployeeDevelopmentPlans } from "@/api/server/development-plan/getEmployeeDevelopmentPlans.ts";
import DevelopmentPlanOverview from "@/components/development-plan/development-plan-overview";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
  const previousPlans = await getEmployeeDevelopmentPlans(id);
  const latestPlan = previousPlans.length > 0 ? previousPlans[0] : null;

  return (
    <div className="space-y-6">
      <DevelopmentPlanOverview
        user={latestPlan?.user}
        latestPlan={latestPlan}
        previousPlans={
          previousPlans.length > 1
            ? previousPlans.filter((plan) => plan.id !== latestPlan?.id)
            : []
        }
      />
    </div>
  );
}
