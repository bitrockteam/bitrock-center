"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
import { getTimeEntries, getProjects } from "@/lib/mock-data";
import AddHoursDialog from "./add-hours-dialog";

// Tipo di evento nel calendario
type TimeEntry = {
  date: string;
  project: string;
  hours: number;
  description: string;
  status: string;
};

export default function TimeTrackingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null);

  console.log({ selectedDate });

  const projects = getProjects();
  const timeEntries = getTimeEntries();

  // Filtra le voci in base al progetto selezionato
  const filteredEntries = useMemo(() => {
    return timeEntries.filter(
      (entry) => selectedProject === "all" || entry.project === selectedProject,
    );
  }, [timeEntries, selectedProject]);

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

  console.log({
    firstDayOfMonth,
    adjustedFirstDay,
  });

  // Organizza le voci per data
  const entriesByDate = useMemo(() => {
    const result: Record<string, TimeEntry[]> = {};

    filteredEntries.forEach((entry) => {
      if (!result[entry.date]) {
        result[entry.date] = [];
      }
      result[entry.date].push(entry);
    });

    return result;
  }, [filteredEntries]);

  // Calcola il totale delle ore per ogni giorno
  const hoursPerDay = useMemo(() => {
    const result: Record<string, number> = {};

    Object.entries(entriesByDate).forEach(([date, entries]) => {
      result[date] = entries.reduce((sum, entry) => sum + entry.hours, 0);
    });

    return result;
  }, [entriesByDate]);

  // Funzione per ottenere il nome del mese
  const getMonthName = (date: Date) => {
    return date.toLocaleString("it-IT", { month: "long" });
  };

  // Funzione per passare al mese precedente
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // Funzione per passare al mese successivo
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Funzione per ottenere le voci di un giorno specifico
  const getEntriesForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = date.toISOString().split("T")[0];
    return entriesByDate[dateKey] || [];
  };

  // Funzione per ottenere il totale delle ore di un giorno specifico
  const getHoursForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = date.toISOString().split("T")[0];
    return hoursPerDay[dateKey] || 0;
  };

  // Funzione per ottenere il colore di sfondo in base alle ore lavorate
  const getBackgroundColor = (hours: number) => {
    if (hours === 0) return "bg-transparent";
    if (hours < 4) return "bg-blue-100 dark:bg-blue-900/20";
    if (hours < 8) return "bg-blue-200 dark:bg-blue-900/40";
    return "bg-blue-300 dark:bg-blue-900/60";
  };

  // Funzione per ottenere il colore del testo in base allo stato
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-amber-600 dark:text-amber-400";
      case "rejected":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Funzione per aprire il dialog di aggiunta ore
  const handleAddHours = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = date.toISOString().split("T")[0];
    setSelectedDate(dateKey);
    setShowAddDialog(true);
  };

  // Funzione per modificare una voce esistente
  const handleEditEntry = (entry: TimeEntry) => {
    setEditEntry(entry);
    setShowAddDialog(true);
  };

  console.log({ adjustedFirstDay, daysInMonth });

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

  console.log({ calendarDays });

  // Nomi dei giorni della settimana
  const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Calendario Ore</CardTitle>
              <CardDescription>
                Visualizza e gestisci le ore lavorate
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleziona progetto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i progetti</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium min-w-[120px] text-center">
                  {getMonthName(currentDate).charAt(0).toUpperCase() +
                    getMonthName(currentDate).slice(1)}{" "}
                  {currentDate.getFullYear()}
                </div>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
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

              console.log({ entries });

              return (
                <div
                  key={`day-${day}`}
                  className={`h-24 p-1 cursor-pointer border rounded-md ${isToday ? "border-primary" : "border-border"} ${getBackgroundColor(totalHours)} ${isWeekend ? "bg-opacity-50 dark:bg-opacity-50" : ""} overflow-hidden relative`}
                  onClick={() => {
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
                  <div className="mt-1 space-y-1">
                    {entries.slice(0, 2).map((entry, entryIndex) => (
                      <TooltipProvider key={entryIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`text-xs px-1 py-0.5 rounded bg-background/80 dark:bg-background/80 ${getStatusColor(entry.status)} truncate cursor-pointer`}
                              onClick={() => handleEditEntry(entry)}
                            >
                              {projects.find((p) => p.id === entry.project)
                                ?.name || entry.project}
                              : {entry.hours}h
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">
                              {projects.find((p) => p.id === entry.project)
                                ?.name || entry.project}
                            </p>
                            <p>Ore: {entry.hours}</p>
                            <p>{entry.description}</p>
                            <p className="capitalize">Stato: {entry.status}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                    {entries.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{entries.length - 2} altre voci
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-1 right-1 h-6 w-6 opacity-0 hover:opacity-100 focus:opacity-100 bg-background/80 dark:bg-background/80"
                    onClick={() => handleAddHours(day)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
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
        }}
      />
    </motion.div>
  );
}
