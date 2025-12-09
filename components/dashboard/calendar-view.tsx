"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { use, useMemo, useState } from "react";
import type { UserTimesheet } from "@/app/server-actions/timesheet/fetchUserTimesheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PermitStatus, PermitType, type permit } from "@/db";

export default function CalendarView({
  timesheetData,
  permitsData,
}: {
  timesheetData: Promise<UserTimesheet[]>;
  permitsData: Promise<permit[]>;
}) {
  const timesheet = use(timesheetData);
  const permits = use(permitsData);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Funzione per ottenere il nome del mese
  const getMonthName = (date: Date) => {
    return date.toLocaleString("it-IT", { month: "long" });
  };

  // Funzione per passare al mese precedente
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Funzione per passare al mese successivo
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Funzione per ottenere gli eventi di un giorno specifico
  const getEventsForDay = (day: number) => {
    console.info(day);
    return {
      permits: permits.filter((permit) => {
        const permitDate = new Date(permit.date);
        if (permitDate.getDate() === day) {
          console.info(permit.date, permitDate, day);
        }
        return (
          permitDate.getDate() === day &&
          permitDate.getMonth() === currentDate.getMonth() &&
          permitDate.getFullYear() === currentDate.getFullYear()
        );
      }),
      timesheet: timesheet.filter((ts) => {
        const tsDate = new Date(ts.date);
        return (
          tsDate.getDate() === day &&
          tsDate.getMonth() === currentDate.getMonth() &&
          tsDate.getFullYear() === currentDate.getFullYear()
        );
      }),
    };
  };

  // Funzione per ottenere il colore del badge in base al tipo di evento
  const getEventBadgeColor = (type?: PermitType) => {
    switch (type) {
      case undefined:
        return "bg-blue-500";
      case PermitType.VACATION:
        return "bg-green-500";
      case PermitType.PERMISSION:
        return "bg-amber-500";
      case PermitType.SICKNESS:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Funzione per ottenere l'etichetta del tipo di evento
  const getEventTypeLabel = (type?: PermitType) => {
    switch (type) {
      case undefined:
        return "Lavoro";
      case PermitType.VACATION:
        return "Ferie";
      case PermitType.PERMISSION:
        return "Permesso";
      case PermitType.SICKNESS:
        return "Malattia";
      default:
        return type;
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
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendario Attività</CardTitle>
              <CardDescription>Visualizza ore lavorate, ferie e permessi</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
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
                  <div key={`empty-${index}`} className="h-24 p-1 border border-transparent"></div>
                );
              }

              const dailyEvents = getEventsForDay(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              const totalEvents = dailyEvents.permits.length + dailyEvents.timesheet.length;

              return (
                <div
                  key={`day-${day}`}
                  className={`h-24 p-1 border rounded-md ${isToday ? "border-primary" : "border-border"} overflow-hidden`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>
                      {day}
                    </span>
                    {dailyEvents.permits.length > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full"
                            onClick={() => {}}
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Eventi del {day} {getMonthName(currentDate)}{" "}
                              {currentDate.getFullYear()}
                            </DialogTitle>
                            <DialogDescription>
                              Dettaglio degli eventi per questa giornata
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {dailyEvents.permits.map((event, eventIndex) => (
                              <div key={eventIndex} className="border rounded-md p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge className={getEventBadgeColor(event.type)}>
                                    {getEventTypeLabel(event.type)}
                                  </Badge>
                                  <Badge
                                    variant={
                                      event.status === PermitStatus.APPROVED
                                        ? "outline"
                                        : event.status === PermitStatus.PENDING
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {event.status === PermitStatus.APPROVED
                                      ? "Approvato"
                                      : event.status === PermitStatus.PENDING
                                        ? "In attesa"
                                        : "Rifiutato"}
                                  </Badge>
                                </div>
                                {event.duration && (
                                  <p className="text-sm mb-1">Ore: {Number(event.duration)}h</p>
                                )}
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dailyEvents.timesheet.slice(0, 2).map((event, eventIndex) => (
                      <TooltipProvider key={eventIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`text-xs px-1 py-0.5 rounded ${getEventBadgeColor()} text-white truncate`}
                            >
                              {`${event.hours}h`}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getEventTypeLabel()}</p>
                            {event.hours && <p>Ore: {event.hours}</p>}
                            <p>{event.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                    {totalEvents > 2 && (
                      <div className="text-xs text-muted-foreground">+{totalEvents - 2} altri</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-4 mt-6">
            <div className="text-sm font-medium">Legenda:</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Lavoro</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Ferie</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs">Permesso</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Malattia</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
