"use client";

import type { SaturationEmployee } from "@/app/server-actions/saturation/fetchSaturationData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllocationBarPosition, getDefaultDateRange } from "@/utils/gantt";
import { getAllocationBadgeColor } from "@/utils/saturation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type GanttChartProps = {
  employees: SaturationEmployee[];
  dateRange?: { start: Date; end: Date };
  isInteractive?: boolean;
  onCellClick?: (employeeId: string, date: Date) => void;
  projectionAllocations?: Array<{
    user_id: string;
    start_date: Date;
    end_date: Date | null;
    percentage: number;
    work_item_title?: string | null;
  }>;
};

export default function GanttChart({
  employees,
  dateRange: initialDateRange,
  isInteractive = false,
  onCellClick,
  projectionAllocations = [],
}: GanttChartProps) {
  const [dateRange, setDateRange] = useState(initialDateRange ?? getDefaultDateRange());
  const [hoveredEmployeeId, setHoveredEmployeeId] = useState<string | null>(null);
  const employeeListRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sync vertical scrolling between employee list and timeline
  useEffect(() => {
    const employeeList = employeeListRef.current;
    const timeline = timelineRef.current;
    if (!employeeList || !timeline) return;

    const handleTimelineScroll = () => {
      if (employeeList) {
        employeeList.scrollTop = timeline.scrollTop;
      }
    };

    const handleEmployeeListScroll = () => {
      if (timeline) {
        timeline.scrollTop = employeeList.scrollTop;
      }
    };

    timeline.addEventListener("scroll", handleTimelineScroll);
    employeeList.addEventListener("scroll", handleEmployeeListScroll);

    return () => {
      timeline.removeEventListener("scroll", handleTimelineScroll);
      employeeList.removeEventListener("scroll", handleEmployeeListScroll);
    };
  }, []);

  const days = useMemo(() => {
    const daysList: Date[] = [];
    const current = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    while (current <= end) {
      daysList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return daysList;
  }, [dateRange]);

  const handlePreviousMonth = () => {
    const newStart = new Date(dateRange.start);
    newStart.setMonth(newStart.getMonth() - 1);
    const newEnd = new Date(dateRange.end);
    newEnd.setMonth(newEnd.getMonth() - 1);
    setDateRange({ start: newStart, end: newEnd });
  };

  const handleNextMonth = () => {
    const newStart = new Date(dateRange.start);
    newStart.setMonth(newStart.getMonth() + 1);
    const newEnd = new Date(dateRange.end);
    newEnd.setMonth(newEnd.getMonth() + 1);
    setDateRange({ start: newStart, end: newEnd });
  };

  const getBarsForEmployee = (employee: SaturationEmployee) => {
    const bars: Array<{
      startOffset: number;
      width: number;
      percentage: number;
      workItemTitle: string;
      isProjection: boolean;
      startDate: Date;
      endDate: Date | null;
    }> = [];

    // Real allocations
    employee.allocations.forEach((alloc) => {
      const bar = getAllocationBarPosition(
        alloc.start_date,
        alloc.end_date,
        dateRange.start,
        dateRange.end
      );
      if (bar) {
        bars.push({
          startOffset: bar.startOffset,
          width: bar.width,
          percentage: alloc.percentage,
          workItemTitle: alloc.work_item_title,
          isProjection: false,
          startDate: alloc.start_date,
          endDate: alloc.end_date,
        });
      }
    });

    // Projection allocations
    projectionAllocations
      .filter((pa) => pa.user_id === employee.id)
      .forEach((alloc) => {
        const bar = getAllocationBarPosition(
          alloc.start_date,
          alloc.end_date,
          dateRange.start,
          dateRange.end
        );
        if (bar) {
          bars.push({
            startOffset: bar.startOffset,
            width: bar.width,
            percentage: alloc.percentage,
            workItemTitle: alloc.work_item_title ?? "Projection",
            isProjection: true,
            startDate: alloc.start_date,
            endDate: alloc.end_date,
          });
        }
      });

    return bars;
  };

  const cellWidth = 40; // Width of each day cell in pixels

  return (
    <div className="flex flex-col h-full">
      {/* Header with date navigation */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-medium min-w-[200px] text-center">
            {dateRange.start.toLocaleDateString("it-IT", {
              month: "short",
              year: "numeric",
            })}{" "}
            -{" "}
            {dateRange.end.toLocaleDateString("it-IT", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Employee list (left side - fixed) */}
        <div className="w-64 border-r bg-background flex flex-col shrink-0">
          <div className="sticky top-0 bg-background border-b p-2 font-medium text-sm z-20">
            Employee
          </div>
          <div ref={employeeListRef} className="flex-1 overflow-y-auto">
            {employees.map((employee) => {
              const bars = getBarsForEmployee(employee);
              const hasMultipleAllocations = bars.length >= 2;
              const isHovered = hoveredEmployeeId === employee.id;
              const shouldExpand = hasMultipleAllocations && isHovered;
              const rowHeight = shouldExpand ? `${bars.length * 60 + 20}px` : "60px";

              return (
                <div
                  key={employee.id}
                  className="flex items-center gap-2 p-2 border-b"
                  style={{
                    minHeight: rowHeight,
                    height: rowHeight,
                  }}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    {employee.avatar_url && (
                      <AvatarImage src={employee.avatar_url} alt={employee.name} />
                    )}
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{employee.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{employee.email}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gantt chart (right side - scrollable) */}
        <div ref={timelineRef} className="flex-1 overflow-auto relative">
          <div className="relative">
            {/* Date headers - sticky */}
            <div className="sticky top-0 bg-background border-b z-10">
              <div className="flex" style={{ width: `${days.length * cellWidth}px` }}>
                {days.map((day) => {
                  const isFirstOfMonth = day.getDate() === 1;
                  const isMonday = day.getDay() === 1;
                  return (
                    <div
                      key={day.toISOString()}
                      className={`border-r text-xs text-center p-1 ${
                        isFirstOfMonth || isMonday ? "font-medium bg-muted/50" : ""
                      }`}
                      style={{
                        width: `${cellWidth}px`,
                        minWidth: `${cellWidth}px`,
                      }}
                    >
                      {isFirstOfMonth || isMonday
                        ? day.toLocaleDateString("it-IT", {
                            month: "short",
                            day: "numeric",
                          })
                        : day.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Employee rows with allocation bars */}
            {employees.map((employee) => {
              const bars = getBarsForEmployee(employee);
              const hasMultipleAllocations = bars.length >= 2;
              const isHovered = hoveredEmployeeId === employee.id;
              const shouldExpand = hasMultipleAllocations && isHovered;
              const rowHeight = shouldExpand ? `${bars.length * 60 + 20}px` : "60px";

              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: Gantt chart row container with hover effects for visual feedback
                <div
                  key={employee.id}
                  className="relative border-b flex flex-col"
                  style={{
                    width: `${days.length * cellWidth}px`,
                    minHeight: rowHeight,
                    height: rowHeight,
                  }}
                  onMouseEnter={() => {
                    if (hasMultipleAllocations) {
                      setHoveredEmployeeId(employee.id);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredEmployeeId(null);
                  }}
                >
                  {/* Day cells */}
                  <div className="absolute inset-0 flex">
                    {days.map((day) => {
                      const today = new Date();
                      const isToday =
                        day.getDate() === today.getDate() &&
                        day.getMonth() === today.getMonth() &&
                        day.getFullYear() === today.getFullYear();
                      const cellLabel = `${employee.name} - ${day.toLocaleDateString("it-IT", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`;

                      if (isInteractive) {
                        return (
                          <button
                            key={day.toISOString()}
                            type="button"
                            className={`border-r h-full ${
                              isToday ? "bg-primary/5" : ""
                            } hover:bg-muted/50 cursor-pointer`}
                            style={{
                              width: `${cellWidth}px`,
                              minWidth: `${cellWidth}px`,
                            }}
                            onClick={() => onCellClick?.(employee.id, day)}
                            aria-label={cellLabel}
                          />
                        );
                      }

                      return (
                        <div
                          key={day.toISOString()}
                          className={`border-r h-full ${isToday ? "bg-primary/5" : ""}`}
                          style={{
                            width: `${cellWidth}px`,
                            minWidth: `${cellWidth}px`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Allocation bars */}
                  {shouldExpand ? (
                    // Expanded view: each allocation on its own line
                    <div className="relative flex-1 flex flex-col justify-center gap-3 py-3">
                      {bars.map((bar, index) => (
                        <div
                          key={`${employee.id}-${index}`}
                          className="relative flex flex-col gap-1"
                        >
                          {/* Date labels for expanded view */}
                          <div
                            className="text-[10px] text-muted-foreground whitespace-nowrap px-1"
                            style={{
                              marginLeft: `${bar.startOffset * cellWidth}px`,
                            }}
                          >
                            {bar.startDate.toLocaleDateString("it-IT", {
                              month: "short",
                              day: "numeric",
                            })}
                            {bar.endDate && (
                              <>
                                {" - "}
                                {bar.endDate.toLocaleDateString("it-IT", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </>
                            )}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`h-8 rounded-sm ${
                                    bar.isProjection
                                      ? "border-2 border-dashed opacity-70"
                                      : "opacity-90"
                                  } ${getAllocationBadgeColor(bar.percentage)}`}
                                  style={{
                                    marginLeft: `${bar.startOffset * cellWidth}px`,
                                    width: `${bar.width * cellWidth}px`,
                                    cursor: "pointer",
                                  }}
                                >
                                  <div className="h-full flex items-center justify-between text-white text-xs font-medium px-2">
                                    <span className="truncate">{bar.workItemTitle}</span>
                                    <span className="ml-2 shrink-0">{bar.percentage}%</span>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <div className="font-medium">{bar.workItemTitle}</div>
                                  <div className="text-xs">
                                    {bar.startDate.toLocaleDateString("it-IT", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}{" "}
                                    -{" "}
                                    {bar.endDate
                                      ? bar.endDate.toLocaleDateString("it-IT", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })
                                      : "Ongoing"}
                                  </div>
                                  <div className="text-xs">Allocation: {bar.percentage}%</div>
                                  {bar.isProjection && (
                                    <div className="text-xs text-muted-foreground">
                                      (Projection)
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Collapsed view: all allocations on one line (original behavior)
                    bars.map((bar, index) => (
                      <TooltipProvider key={`${employee.id}-${index}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`absolute h-8 rounded-sm ${
                                bar.isProjection
                                  ? "border-2 border-dashed opacity-70"
                                  : "opacity-90"
                              } ${getAllocationBadgeColor(bar.percentage)}`}
                              style={{
                                left: `${bar.startOffset * cellWidth}px`,
                                width: `${bar.width * cellWidth}px`,
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                              }}
                            >
                              <div className="h-full flex items-center justify-center text-white text-xs font-medium px-1 truncate">
                                {bar.percentage}%
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <div className="font-medium">{bar.workItemTitle}</div>
                              <div className="text-xs">
                                {bar.startDate.toLocaleDateString("it-IT", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}{" "}
                                -{" "}
                                {bar.endDate
                                  ? bar.endDate.toLocaleDateString("it-IT", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Ongoing"}
                              </div>
                              <div className="text-xs">Allocation: {bar.percentage}%</div>
                              {bar.isProjection && (
                                <div className="text-xs text-muted-foreground">(Projection)</div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
