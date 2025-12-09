import { Target } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GetLatestEmployeeDevelopmentPlan } from "@/app/server-actions/development-plan/getLatestEmployeeDevelopmentPlan";
import { getGoalStatus, getPlanProgress } from "@/components/development-plan/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getGoalBadge } from "@/utils/mapping";

export default function UserDetailsDevelopment({
  plan: activePlan,
}: {
  plan?: GetLatestEmployeeDevelopmentPlan;
}) {
  const router = useRouter();
  const planProgress = activePlan ? getPlanProgress(activePlan) : null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Piano di Sviluppo</CardTitle>
        <CardDescription>Obiettivi e progressi di sviluppo professionale</CardDescription>
      </CardHeader>
      <CardContent>
        {activePlan && planProgress ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Piano Attuale</h3>
                <p className="text-sm text-muted-foreground">
                  Creato il {new Date(activePlan.created_date).toLocaleDateString("it-IT")}
                </p>
              </div>
              <Button onClick={() => router.push(`/utenti/${activePlan.user_id}/development-plan`)}>
                <Target className="mr-2 h-4 w-4" />
                Visualizza Completo
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress Generale</span>
                <span className="text-sm text-muted-foreground">
                  {planProgress.completed} di {planProgress.total} obiettivi completati
                </span>
              </div>
              <Progress value={planProgress.percentage} className="h-3" />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Obiettivi Recenti</h4>
              {activePlan.goal.slice(0, 3).map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{goal.title}</h5>
                    {getGoalBadge(getGoalStatus(goal))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Progress</span>
                      <span>
                        {goal.todo_item.filter((t) => t.completed).length} di{" "}
                        {goal.todo_item.length} task
                      </span>
                    </div>
                    <Progress
                      value={
                        (goal.todo_item.filter((t) => t.completed).length / goal.todo_item.length) *
                        100
                      }
                      className="h-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nessun piano di sviluppo attivo</h3>
            <p className="text-muted-foreground mb-4">
              Crea un piano di sviluppo per tracciare gli obiettivi professionali.
            </p>
            <Button onClick={() => router.push(`/utenti/${activePlan?.user_id}/development-plan`)}>
              <Target className="mr-2 h-4 w-4" />
              Crea Piano di Sviluppo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
