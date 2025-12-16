"use client";

import type { AllocationWithDetails } from "@/app/server-actions/allocation/fetchAllAllocations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDisplayName } from "@/services/users/utils";
import dayjs from "dayjs";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface AllocationsTableProps {
  allocations: AllocationWithDetails[];
  onEdit: (allocation: AllocationWithDetails) => void;
  onDelete: (allocation: AllocationWithDetails) => void;
  loading?: boolean;
}

interface UserAllocationsGroup {
  user: AllocationWithDetails["user"];
  allocations: AllocationWithDetails[];
  totalAllocations: number;
  averagePercentage: number;
  earliestStartDate: Date | null;
  latestEndDate: Date | null;
}

type SortField = "totalAllocations" | "averagePercentage" | null;
type SortDirection = "asc" | "desc";

export default function AllocationsTable({
  allocations,
  onEdit,
  onDelete,
  loading = false,
}: AllocationsTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [nestedSortField, setNestedSortField] = useState<"percentage" | null>(null);
  const [nestedSortDirection, setNestedSortDirection] = useState<SortDirection>("asc");
  const [openValue, setOpenValue] = useState<string | undefined>(undefined);

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return dayjs(date).format("DD/MM/YYYY");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleNestedSort = (field: "percentage") => {
    if (nestedSortField === field) {
      setNestedSortDirection(nestedSortDirection === "asc" ? "desc" : "asc");
    } else {
      setNestedSortField(field);
      setNestedSortDirection("asc");
    }
  };

  const groupedByUser = useMemo(() => {
    const groups = new Map<string, UserAllocationsGroup>();

    allocations.forEach((allocation) => {
      const userId = allocation.user_id;
      const existing = groups.get(userId);

      if (existing) {
        existing.allocations.push(allocation);
        existing.totalAllocations += 1;
        existing.averagePercentage += allocation.percentage;

        if (allocation.start_date) {
          if (!existing.earliestStartDate || allocation.start_date < existing.earliestStartDate) {
            existing.earliestStartDate = allocation.start_date;
          }
        }

        if (allocation.end_date) {
          if (!existing.latestEndDate || allocation.end_date > existing.latestEndDate) {
            existing.latestEndDate = allocation.end_date;
          }
        }
      } else {
        groups.set(userId, {
          user: allocation.user,
          allocations: [allocation],
          totalAllocations: 1,
          averagePercentage: allocation.percentage,
          earliestStartDate: allocation.start_date,
          latestEndDate: allocation.end_date,
        });
      }
    });

    let result = Array.from(groups.values()).map((group) => ({
      ...group,
      averagePercentage: Math.round(group.averagePercentage / group.totalAllocations),
    }));

    if (sortField) {
      result = [...result].sort((a, b) => {
        let comparison = 0;
        if (sortField === "totalAllocations") {
          comparison = a.totalAllocations - b.totalAllocations;
        } else if (sortField === "averagePercentage") {
          comparison = a.averagePercentage - b.averagePercentage;
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    if (nestedSortField) {
      result = result.map((group) => ({
        ...group,
        allocations: [...group.allocations].sort((a, b) => {
          let comparison = 0;
          if (nestedSortField === "percentage") {
            comparison = a.percentage - b.percentage;
          }
          return nestedSortDirection === "asc" ? comparison : -comparison;
        }),
      }));
    }

    return result;
  }, [allocations, sortField, sortDirection, nestedSortField, nestedSortDirection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  if (allocations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Nessuna allocazione trovata</p>
      </div>
    );
  }

  const handleToggle = (value: string) => {
    setOpenValue(openValue === value ? undefined : value);
  };

  return (
    <div className="rounded-md border w-full">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openValue}
        onValueChange={setOpenValue}
      >
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Utente</TableHead>
              <TableHead className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-0 data-[state=open]:bg-accent font-medium"
                  onClick={() => handleSort("totalAllocations")}
                  aria-label="Ordina per numero di allocazioni"
                  tabIndex={0}
                >
                  Allocazioni
                  {sortField === "totalAllocations" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-0 data-[state=open]:bg-accent font-medium"
                  onClick={() => handleSort("averagePercentage")}
                  aria-label="Ordina per percentuale media"
                  tabIndex={0}
                >
                  Percentuale Media
                  {sortField === "averagePercentage" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="whitespace-nowrap">Periodo</TableHead>
              <TableHead className="w-[50px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByUser.map((group) => (
              <AccordionItem
                key={group.user.id}
                value={group.user.id}
                className="border-0 [&[data-state=open]_svg.accordion-icon]:rotate-180"
              >
                <TableRow className="hover:bg-muted/50 w-full">
                  <TableCell className="min-w-[250px] p-2">
                    <AccordionTrigger className="hover:no-underline [&>svg]:hidden w-full py-0 h-auto -mx-2 px-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          {group.user.avatar_url && <AvatarImage src={group.user.avatar_url} />}
                          <AvatarFallback className="text-sm">
                            {formatDisplayName({
                              name: group.user.name,
                              initials: true,
                            })}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <span className="font-medium truncate">{group.user.name}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {group.user.email}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium whitespace-nowrap">
                        {group.totalAllocations}
                      </span>
                      <span className="text-xs text-muted-foreground">allocazioni</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex flex-col">
                      <Badge variant="outline" className="w-fit">
                        {group.averagePercentage}%
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">media</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium whitespace-nowrap">
                        {formatDate(group.earliestStartDate)} - {formatDate(group.latestEndDate)}
                      </span>
                      <span className="text-xs text-muted-foreground">periodo</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2 text-right w-[50px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-auto w-auto p-0 hover:bg-transparent"
                      onClick={() => handleToggle(group.user.id)}
                      aria-label="Espandi/Dettagli"
                      tabIndex={0}
                    >
                      <ChevronDown
                        className={`accordion-icon h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                          openValue === group.user.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
                <AccordionContent>
                  <div className="px-4 pb-4 pt-2">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Progetto</TableHead>
                            <TableHead>Commessa</TableHead>
                            <TableHead>Data Inizio</TableHead>
                            <TableHead>Data Fine</TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-0 data-[state=open]:bg-accent font-medium"
                                onClick={() => handleNestedSort("percentage")}
                                aria-label="Ordina per percentuale"
                                tabIndex={0}
                              >
                                Percentuale
                                {nestedSortField === "percentage" ? (
                                  nestedSortDirection === "asc" ? (
                                    <ArrowUp className="ml-2 h-4 w-4" />
                                  ) : (
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                  )
                                ) : (
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
                              </Button>
                            </TableHead>
                            <TableHead className="text-right">Azioni</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.allocations.map((allocation) => (
                            <TableRow key={`${allocation.user_id}-${allocation.work_item_id}`}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {allocation.work_items.client.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {allocation.work_items.client.code}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {allocation.work_items.project ? (
                                  <span>{allocation.work_items.project.name}</span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/commesse/${allocation.work_item_id}`}
                                  className="text-primary hover:underline"
                                >
                                  {allocation.work_items.title}
                                </Link>
                              </TableCell>
                              <TableCell>{formatDate(allocation.start_date)}</TableCell>
                              <TableCell>{formatDate(allocation.end_date)}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{allocation.percentage}%</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(allocation)}
                                    aria-label={`Modifica allocazione di ${allocation.user.name}`}
                                    tabIndex={0}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(allocation)}
                                    aria-label={`Elimina allocazione di ${allocation.user.name}`}
                                    tabIndex={0}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </TableBody>
        </Table>
      </Accordion>
    </div>
  );
}
