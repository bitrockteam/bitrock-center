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
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

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

export default function AllocationsTable({
  allocations,
  onEdit,
  onDelete,
  loading = false,
}: AllocationsTableProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return dayjs(date).format("DD/MM/YYYY");
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

    return Array.from(groups.values()).map((group) => ({
      ...group,
      averagePercentage: Math.round(group.averagePercentage / group.totalAllocations),
    }));
  }, [allocations]);

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utente</TableHead>
            <TableHead>Allocazioni</TableHead>
            <TableHead>Percentuale Media</TableHead>
            <TableHead>Periodo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedByUser.map((group) => (
            <TableRow key={group.user.id} className="p-0">
              <TableCell colSpan={4} className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={group.user.id} className="border-0">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {group.user.avatar_url && <AvatarImage src={group.user.avatar_url} />}
                            <AvatarFallback className="text-sm">
                              {formatDisplayName({ name: group.user.name, initials: true })}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col text-left">
                            <span className="font-medium">{group.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {group.user.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col text-right">
                            <span className="text-sm font-medium">{group.totalAllocations}</span>
                            <span className="text-xs text-muted-foreground">allocazioni</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <Badge variant="outline" className="w-fit">
                              {group.averagePercentage}%
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-1">media</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-sm font-medium">
                              {formatDate(group.earliestStartDate)} -{" "}
                              {formatDate(group.latestEndDate)}
                            </span>
                            <span className="text-xs text-muted-foreground">periodo</span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="rounded-md border mt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cliente</TableHead>
                              <TableHead>Progetto</TableHead>
                              <TableHead>Commessa</TableHead>
                              <TableHead>Data Inizio</TableHead>
                              <TableHead>Data Fine</TableHead>
                              <TableHead>Percentuale</TableHead>
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
