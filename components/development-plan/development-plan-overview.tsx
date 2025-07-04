"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createNewDevelopmentPlan } from "@/server/development-plan/createNewDevelopmentPlan";
import { GetDevelopmentPlan } from "@/server/development-plan/getDevelopmentPlanById";
import { GetEmployeeDevelopmentPlan } from "@/server/development-plan/getEmployeeDevelopmentPlans.ts";
import { getRoleBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getGoalProgress, getGoalStatus, getPlanProgress } from "./utils";

export default function DevelopmentPlanOverview({
  user,
  latestPlan,
  previousPlans,
}: {
  user: GetEmployeeDevelopmentPlan["user"] | undefined;
  latestPlan: GetDevelopmentPlan | null;
  previousPlans: GetDevelopmentPlan[];
}) {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Utente non trovato</h2>
        <p className="text-muted-foreground mb-4">
          L&apos;utente richiesto non esiste o è stato rimosso.
        </p>
        <Button onClick={() => router.push("/utenti")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna agli Utenti
        </Button>
      </div>
    );
  }

  const handleCreateNewPlan = async () => {
    setIsCreating(true);
    const newPlan = await createNewDevelopmentPlan(user.id);
    router.push(`/utenti/${user.id}/development-plan/${newPlan.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/utenti/${user.id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Piano di Sviluppo
            </h1>
            <p className="text-muted-foreground">
              {user.name} - {getRoleBadge(user.role)}
            </p>
          </div>
        </div>
        <Button onClick={handleCreateNewPlan} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Creazione..." : "Nuovo Piano"}
        </Button>
      </div>

      {/* Latest Development Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Piano di Sviluppo Attuale
          </CardTitle>
          <CardDescription>Il piano di sviluppo più recente</CardDescription>
        </CardHeader>
        <CardContent>
          {latestPlan ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Creato il{" "}
                      {new Date(latestPlan.created_date).toLocaleDateString(
                        "it-IT",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {latestPlan.goal.length} obiettivi
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/utenti/${user.id}/development-plan/${latestPlan.id}`,
                    )
                  }
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizza Dettagli
                </Button>
              </div>

              <div className="space-y-4">
                {latestPlan.goal.slice(0, 5).map((goal, index) => {
                  const status = getGoalStatus(goal);
                  const progress = getGoalProgress(goal);
                  const progressPercentage =
                    (progress.completed / progress.total) * 100;

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{goal.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            status === "completed" ? "default" : "secondary"
                          }
                          className="ml-4"
                        >
                          {status === "completed" ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Completato
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              In Corso
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progresso
                          </span>
                          <span className="font-medium">
                            {progress.completed}/{progress.total} attività
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="mt-3 space-y-1">
                        {goal.todo_item.map((todo) => (
                          <div
                            key={todo.id}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                todo.completed
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {todo.completed && (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                            </div>
                            <span
                              className={
                                todo.completed
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }
                            >
                              {todo.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Nessun piano di sviluppo disponibile
              </h3>
              <p className="text-muted-foreground mb-4">
                Crea un nuovo piano per iniziare a tracciare gli obiettivi.
              </p>
              <Button onClick={handleCreateNewPlan} disabled={isCreating}>
                <Plus className="mr-2 h-4 w-4" />
                {isCreating ? "Creazione..." : "Crea Nuovo Piano"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Plans */}
      {previousPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Piani Precedenti
            </CardTitle>
            <CardDescription>Storico dei piani di sviluppo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousPlans.map((plan, index) => {
                const progress = getPlanProgress(plan);
                const progressPercentage =
                  (progress.completed / progress.total) * 100;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="font-medium">
                          Piano del{" "}
                          {new Date(plan.created_date).toLocaleDateString(
                            "it-IT",
                          )}
                        </span>
                        <Badge variant="outline">
                          {plan.goal.length} obiettivi
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Obiettivi completati
                          </span>
                          <span className="font-medium">
                            {progress.completed}/{progress.total}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-4 bg-transparent"
                      onClick={() =>
                        router.push(
                          `/utenti/${user.id}/development-plan/${plan.id}`,
                        )
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizza
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
