"use client";

import { UserTimesheet } from "@/app/server-actions/timesheet/fetchUserTimesheet";
import { WorkItem } from "@/app/server-actions/work-item/fetchAllWorkItems";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { timesheet, user } from "@/db";
import { useTimesheetApi } from "@/hooks/useTimesheetApi";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import AddHoursDialog from "./add-hours-dialog";

// Helper to get local date string in YYYY-MM-DD format
const getLocalDateString = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

export default function TimeTrackingCalendar({
  user,
  work_items,
  timesheets: initialTimesheets,
  isReadyOnly = false,
  onRefresh,
}: {
  user: user;
  work_items: WorkItem[];
  timesheets: UserTimesheet[];
  isReadyOnly?: boolean;
  onRefresh?: () => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<timesheet | null>(null);
  const [timesheets, setTimesheets] = useState(initialTimesheets);
  const { deleteTimesheet, fetchTimesheets, loading } = useTimesheetApi();

  // Ottieni il primo giorno del mese
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }, [currentDate]);

  // Ottieni l'ultimo giorno del mese
  const lastDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  }, [currentDate]);

  // Ottieni il numero di giorni nel mese
  const daysInMonth = useMemo(() => {
    return lastDayOfMonth.getDate();
  }, [lastDayOfMonth]);

  // Ottieni il giorno della settimana del primo giorno del mese (0 = Domenica, 1 = Lunedì, ...)
  const firstDayOfWeek = useMemo(() => {
    return firstDayOfMonth.getDay();
  }, [firstDayOfMonth]);

  // Adatta il primo giorno della settimana per iniziare da Lunedì (0 = Lunedì, 6 = Domenica)
  const adjustedFirstDay = useMemo(() => {
    return firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }, [firstDayOfWeek]);

  // Organizza le voci per data
  const entriesByDate = useMemo(() => {
    const result: Record<string, timesheet[]> = {};

    timesheets.forEach((entry) => {
      const date = getLocalDateString(new Date(entry.date));
      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(entry);
    });

    return result;
  }, [timesheets]);

  // Filtra le voci per progetto selezionato
  const filteredEntriesByDate = useMemo(() => {
    if (selectedProject === "all") {
      return entriesByDate;
    }

    const result: Record<string, timesheet[]> = {};
    Object.keys(entriesByDate).forEach((date) => {
      const filteredEntries = entriesByDate[date].filter(
        (entry) => entry.work_item_id === selectedProject,
      );
      if (filteredEntries.length > 0) {
        result[date] = filteredEntries;
      }
    });

    return result;
  }, [entriesByDate, selectedProject]);

  // Ottieni le voci per un giorno specifico
  const getEntriesForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = getLocalDateString(date);
    return filteredEntriesByDate[dateKey] || [];
  };

  // Ottieni le ore totali per un giorno specifico
  const getHoursForDay = (day: number) => {
    const entries = getEntriesForDay(day);
    return entries.reduce((total, entry) => total + entry.hours, 0);
  };

  // Ottieni il colore di sfondo basato sulle ore
  const getBackgroundColor = (hours: number) => {
    if (hours === 0) return "bg-background";
    if (hours < 4) return "bg-blue-100 dark:bg-blue-900/20";
    if (hours < 8) return "bg-blue-200 dark:bg-blue-900/40";
    return "bg-blue-300 dark:bg-blue-900/60";
  };

  // Funzione per aprire il dialog di aggiunta ore
  const handleAddHours = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = getLocalDateString(date);
    setSelectedDate(dateKey);
    setShowAddDialog(true);
  };

  // Funzione per modificare una voce esistente
  const handleEditEntry = (entry: timesheet) => {
    setEditEntry(entry);
    setShowAddDialog(true);
  };

  // Funzione per eliminare una voce esistente
  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteTimesheet(id);
      if (onRefresh) {
        onRefresh();
      } else {
        // Refresh internally if no onRefresh prop provided
        try {
          const updatedTimesheets = await fetchTimesheets();
          if (updatedTimesheets && Array.isArray(updatedTimesheets)) {
            setTimesheets(updatedTimesheets);
          }
        } catch (error) {
          console.error("Error refreshing timesheets:", error);
        }
      }
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Refresh internally if no onRefresh prop provided
      try {
        const updatedTimesheets = await fetchTimesheets();
        if (updatedTimesheets && Array.isArray(updatedTimesheets)) {
          setTimesheets(updatedTimesheets);
        }
      } catch (error) {
        console.error("Error refreshing timesheets:", error);
      }
    }
  };

  // Genera i giorni del calendario
  const calendarDays = useMemo(() => {
    const days = [];

    // Aggiungi i giorni vuoti all'inizio per allineare con il giorno della settimana
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }

    // Aggiungi i giorni del mese
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [adjustedFirstDay, daysInMonth]);

  // Nomi dei giorni della settimana
  const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Calendario Ore</CardTitle>
              <CardDescription>
                Visualizza le ore lavorate in formato calendario
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtra per progetto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i progetti</SelectItem>
                  {work_items?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                  ),
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium">
              {currentDate.toLocaleDateString("it-IT", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                  ),
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {/* Intestazioni dei giorni della settimana */}
            {weekDays.map((day, index) => (
              <div key={index} className="text-center font-medium text-sm py-2">
                {day}
              </div>
            ))}

            {/* Giorni del calendario */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-24 p-1 border border-transparent"
                  ></div>
                );
              }

              const entries = getEntriesForDay(day);
              const totalHours = getHoursForDay(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();
              const isWeekend =
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day,
                ).getDay() === 0 ||
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day,
                ).getDay() === 6;

              return (
                <div
                  key={`day-${day}`}
                  className={`h-24 p-1 ${!isReadyOnly && "cursor-pointer"} border rounded-md ${isToday ? "border-primary" : "border-border"} ${getBackgroundColor(totalHours)} ${isWeekend ? "bg-opacity-50 dark:bg-opacity-50" : ""} overflow-hidden relative`}
                  onClick={() => {
                    if (isReadyOnly) return;
                    setSelectedDate(
                      `${currentDate.getFullYear()}-${currentDate.getMonth() < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${day < 10 ? `0${day}` : day}`,
                    );
                    setShowAddDialog(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-sm font-medium ${isToday ? "text-primary" : ""} ${isWeekend ? "text-muted-foreground" : ""}`}
                    >
                      {day}
                    </span>
                    {totalHours > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {totalHours}h
                      </Badge>
                    )}
                  </div>

                  {/* Lista delle voci per questo giorno */}
                  <div className="mt-1 space-y-1">
                    {entries.slice(0, 2).map((entry, entryIndex) => (
                      <TooltipProvider key={entryIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-between text-xs bg-background/80 rounded px-1 py-0.5">
                              <span className="truncate">
                                {
                                  work_items?.find(
                                    (p) => p.id === entry.work_item_id,
                                  )?.title
                                }
                              </span>
                              <span className="font-medium">
                                {entry.hours}h
                              </span>
                              {!isReadyOnly && (
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditEntry(entry);
                                    }}
                                  >
                                    <Plus className="h-2 w-2" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Trash2 className="h-2 w-2" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Conferma eliminazione
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Sei sicuro di voler eliminare questa
                                          registrazione? Questa azione non può
                                          essere annullata.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Annulla
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteEntry(entry.id)
                                          }
                                          disabled={loading}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          {loading
                                            ? "Eliminazione..."
                                            : "Elimina"}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <p className="font-medium">
                                {
                                  work_items?.find(
                                    (p) => p.id === entry.work_item_id,
                                  )?.title
                                }
                              </p>
                              <p>{entry.hours} ore</p>
                              {entry.description && (
                                <p className="text-xs">{entry.description}</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                    {entries.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{entries.length - 2} altre
                      </div>
                    )}
                  </div>

                  {!isReadyOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-1 right-1 h-6 w-6 opacity-0 hover:opacity-100 focus:opacity-100 bg-background/80 dark:bg-background/80"
                      onClick={() => handleAddHours(day)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-4 mt-6">
            <div className="text-sm font-medium">Legenda:</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"></div>
                <span className="text-xs">&lt; 4 ore</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-200 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700"></div>
                <span className="text-xs">4-8 ore</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-300 dark:bg-blue-900/60 border border-blue-400 dark:border-blue-600"></div>
                <span className="text-xs">&gt; 8 ore</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog per aggiungere/modificare ore */}
      <AddHoursDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        editData={editEntry}
        defaultDate={selectedDate}
        onClose={() => {
          setEditEntry(null);
          setSelectedDate(null);
          handleRefresh();
        }}
        user={user}
      />
    </motion.div>
  );
}
