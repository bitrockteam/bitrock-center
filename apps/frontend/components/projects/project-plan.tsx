"use client";

import { Button } from "@/components/ui/button";
import { getProjectById } from "@/lib/mock-data";
import { getProjectPlanData } from "@/lib/mock-data-plan";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronRight, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProjectPlan({ id }: { id: string }) {
  const router = useRouter();

  const fakeProjectId = "project-1"; // TODO: Replace with dynamic project fetching logic
  const project = getProjectById(fakeProjectId);
  const planData = getProjectPlanData(fakeProjectId);

  const [expandedEpics, setExpandedEpics] = useState<Record<string, boolean>>(
    {},
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Inizializza tutti gli epic come espansi
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    planData.epics.forEach((epic) => {
      initialExpandedState[epic.id] = true;
    });
    setExpandedEpics(initialExpandedState);
  }, [planData.epics]);

  const toggleEpic = (epicId: string) => {
    setExpandedEpics((prev) => ({
      ...prev,
      [epicId]: !prev[epicId],
    }));
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Progetto non trovato</h2>
        <p className="text-muted-foreground mb-4">
          Il progetto richiesto non esiste o è stato rimosso.
        </p>
        <Button onClick={() => router.push("/progetti")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna ai Progetti
        </Button>
      </div>
    );
  }

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
            onClick={() => router.push(`/progetti/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Piano di Delivery
            </h1>
            <p className="text-muted-foreground">
              {project.name} - {project.client}
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Esporta
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="relative flex">
          {/* Sidebar sinistra fissa */}
          <div className="sticky left-0 z-20 bg-background border-r border-border">
            {/* Header della sidebar */}
            <div className="bg-primary text-primary-foreground">
              <div className="flex">
                <div className="w-64 min-w-12 border-r border-primary-foreground/20 p-3 font-medium">
                  Attività
                </div>
                <div className="w-24 min-w-24 overflow-auto p-3 font-medium text-center">
                  DIFF
                </div>
              </div>
            </div>

            {/* Corpo della sidebar */}
            <div>
              {planData.epics.map((epic, epicIndex) => (
                <div key={epicIndex}>
                  {/* Riga dell'epic */}
                  <div
                    className={cn(
                      "flex hover:bg-muted/50 cursor-pointer border-b border-border",
                      epicIndex % 2 === 0 ? "bg-muted/20" : "",
                    )}
                    onClick={() => toggleEpic(epic.id)}
                  >
                    <div className="w-64 min-w-64 border-r border-border p-3 font-medium flex items-center">
                      {expandedEpics[epic.id] ? (
                        <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                      )}
                      <span className="truncate">{epic.name}</span>
                    </div>

                    <div
                      className={cn(
                        "w-16 min-w-16 p-3 text-center",
                        epic.diff < 0
                          ? "text-destructive font-medium"
                          : epic.diff > 0
                            ? "text-green-600 dark:text-green-500 font-medium"
                            : "",
                      )}
                    >
                      {epic.diff}
                    </div>
                  </div>

                  {/* Righe delle attività dell'epic */}
                  {expandedEpics[epic.id] &&
                    epic.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className={cn(
                          "flex hover:bg-muted/30 border-b border-border",
                          epicIndex % 2 === 0 ? "bg-muted/10" : "",
                        )}
                      >
                        <div className="w-64 min-w-64 border-r border-border p-3 pl-8 overflow-auto">
                          <span className="truncate">{activity.name}</span>
                        </div>
                        <div
                          className={cn(
                            "w-16 min-w-16 p-3 text-center",
                            activity.diff < 0
                              ? "text-destructive font-medium"
                              : activity.diff > 0
                                ? "text-green-600 dark:text-green-500 font-medium"
                                : "",
                          )}
                        >
                          {activity.diff}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Area scrollabile per i giorni */}
          <div className="flex-1 overflow-x-auto" ref={containerRef}>
            {/* Header dei giorni */}
            <div className="sticky top-0 z-10 bg-primary text-primary-foreground w-fit">
              <div className="flex">
                {planData.days.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-16 min-w-16 border-r border-primary-foreground/20 p-2 text-center text-xs font-medium",
                      day.isWeekend ? "bg-primary-foreground/10" : "",
                    )}
                  >
                    <div>{day.date}</div>
                    <div>{day.dayOfWeek}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corpo dei giorni */}
            <div>
              {planData.epics.map((epic, epicIndex) => (
                <div key={epicIndex}>
                  {/* Riga dell'epic per i giorni */}
                  <div
                    className={cn(
                      "flex border-b border-border",
                      epicIndex % 2 === 0 ? "bg-muted/20" : "",
                    )}
                  >
                    {planData.days.map((day, dayIndex) => {
                      const cellData = epic.timeline.find(
                        (t) => t.day === day.date,
                      );
                      return (
                        <div
                          key={dayIndex}
                          className={cn(
                            "w-16 min-w-16 border-r border-border h-12",
                            day.isWeekend ? "bg-muted/30" : "",
                            cellData?.status === "active"
                              ? "bg-blue-200 dark:bg-blue-900/50"
                              : cellData?.status === "weekend"
                                ? "bg-amber-200 dark:bg-amber-900/50"
                                : "",
                          )}
                        >
                          &nbsp;
                        </div>
                      );
                    })}
                  </div>

                  {/* Righe delle attività dell'epic per i giorni */}
                  {expandedEpics[epic.id] &&
                    epic.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className={cn(
                          "flex border-b border-border",
                          epicIndex % 2 === 0 ? "bg-muted/10" : "",
                        )}
                      >
                        {planData.days.map((day, dayIndex) => {
                          const cellData = activity.timeline.find(
                            (t) => t.day === day.date,
                          );
                          return (
                            <div
                              key={dayIndex}
                              className={cn(
                                "w-16 min-w-16 border-r border-border h-12",
                                day.isWeekend ? "bg-muted/30" : "",
                                cellData?.status === "active"
                                  ? "bg-blue-200 dark:bg-blue-900/50"
                                  : cellData?.status === "weekend"
                                    ? "bg-amber-200 dark:bg-amber-900/50"
                                    : cellData?.status === "critical"
                                      ? "bg-blue-800 dark:bg-blue-950"
                                      : "",
                              )}
                            >
                              &nbsp;
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
