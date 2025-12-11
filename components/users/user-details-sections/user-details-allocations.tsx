"use client";

import type { UserAllocationRecap } from "@/app/server-actions/user/fetchUserAllocations";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/useApi";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface UserDetailsAllocationsProps {
  userId: string;
}

export default function UserDetailsAllocations({
  userId,
}: UserDetailsAllocationsProps) {
  const { data: allocationsData, callApi: fetchAllocations } =
    useApi<UserAllocationRecap>();

  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (userId && userIdRef.current !== userId) {
      userIdRef.current = userId;
      fetchAllocations(`/api/user/allocations?userId=${userId}`);
    }
  }, [userId, fetchAllocations]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Non definita";
    return dayjs(date).format("DD/MM/YYYY");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      ACTIVE: { label: "Attivo", variant: "default" },
      PLANNED: { label: "Pianificato", variant: "secondary" },
      PAUSED: { label: "In pausa", variant: "outline" },
      COMPLETED: { label: "Completato", variant: "secondary" },
    };
    const statusInfo = statusMap[status] || {
      label: status,
      variant: "outline",
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (!allocationsData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Caricamento allocazioni...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Allocazioni Attive</CardDescription>
            <CardTitle className="text-2xl">
              {allocationsData.activeAllocations}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Totale Allocazioni</CardDescription>
            <CardTitle className="text-2xl">
              {allocationsData.totalAllocations}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ferie Rimanenti</CardDescription>
            <CardTitle
              className={`text-2xl ${
                allocationsData.daysOffLeft <= 5
                  ? "text-destructive"
                  : allocationsData.daysOffLeft <= 10
                  ? "text-yellow-600"
                  : ""
              }`}
            >
              {allocationsData.daysOffLeft} giorni
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ferie Pianificate</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {allocationsData.daysOffPlanned} giorni
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Allocazioni Progetti</CardTitle>
          <CardDescription>
            Elenco completo delle allocazioni ai progetti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Progetto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Stato Progetto</TableHead>
                <TableHead>% Allocazione</TableHead>
                <TableHead>Data Inizio</TableHead>
                <TableHead>Data Fine</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocationsData.allocations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Nessuna allocazione trovata
                  </TableCell>
                </TableRow>
              ) : (
                allocationsData.allocations.map((allocation) => (
                  <TableRow key={allocation.projectId}>
                    <TableCell>
                      <Link
                        href={`/progetti/${allocation.projectId}`}
                        className="font-medium hover:underline text-primary"
                        aria-label={`Visualizza progetto ${allocation.projectName}`}
                      >
                        {allocation.projectName}
                      </Link>
                    </TableCell>
                    <TableCell>{allocation.clientName}</TableCell>
                    <TableCell>
                      {getStatusBadge(allocation.projectStatus)}
                    </TableCell>
                    <TableCell>{allocation.percentage}%</TableCell>
                    <TableCell>{formatDate(allocation.startDate)}</TableCell>
                    <TableCell>{formatDate(allocation.endDate)}</TableCell>
                    <TableCell>
                      {allocation.isActive ? (
                        <Badge variant="default">Attiva</Badge>
                      ) : (
                        <Badge variant="secondary">Non attiva</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
