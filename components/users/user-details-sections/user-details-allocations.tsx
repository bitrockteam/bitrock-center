"use client";

import type { UserAllocationRecap } from "@/app/server-actions/user/fetchUserAllocations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Edit2, RotateCcw, Save, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UserDetailsAllocationsProps {
  userId: string;
  currentUserId?: string;
}

export default function UserDetailsAllocations({
  userId,
  currentUserId,
}: UserDetailsAllocationsProps) {
  const { data: allocationsData, callApi: fetchAllocations } =
    useApi<UserAllocationRecap>();
  const { callApi: updateDaysOff } = useApi();

  const userIdRef = useRef<string | null>(null);
  const isOwnProfile = currentUserId === userId;
  const [isEditingLeft, setIsEditingLeft] = useState(false);
  const [isEditingPlanned, setIsEditingPlanned] = useState(false);
  const [daysOffLeft, setDaysOffLeft] = useState<number | null>(null);
  const [daysOffPlanned, setDaysOffPlanned] = useState<number | null>(null);
  const [isSavingLeft, setIsSavingLeft] = useState(false);
  const [isSavingPlanned, setIsSavingPlanned] = useState(false);

  useEffect(() => {
    if (userId && userIdRef.current !== userId) {
      userIdRef.current = userId;
      fetchAllocations(`/api/user/allocations?userId=${userId}`);
    }
  }, [userId, fetchAllocations]);

  useEffect(() => {
    if (allocationsData) {
      setDaysOffLeft(allocationsData.daysOffLeft);
      setDaysOffPlanned(allocationsData.daysOffPlanned);
    }
  }, [allocationsData]);

  const handleEditLeft = () => {
    setIsEditingLeft(true);
  };

  const handleEditPlanned = () => {
    setIsEditingPlanned(true);
  };

  const handleCancelLeft = () => {
    if (allocationsData) {
      setDaysOffLeft(allocationsData.daysOffLeft);
    }
    setIsEditingLeft(false);
  };

  const handleCancelPlanned = () => {
    if (allocationsData) {
      setDaysOffPlanned(allocationsData.daysOffPlanned);
    }
    setIsEditingPlanned(false);
  };

  const handleSaveLeft = async () => {
    if (!allocationsData) return;
    setIsSavingLeft(true);
    try {
      await updateDaysOff("/api/user/days-off", {
        method: "PATCH",
        body: JSON.stringify({
          userId,
          daysOffLeft: daysOffLeft ?? null,
          daysOffPlanned: allocationsData.daysOffPlanned ?? null,
        }),
      });
      toast.success("Ferie rimanenti aggiornate con successo");
      setIsEditingLeft(false);
      await fetchAllocations(`/api/user/allocations?userId=${userId}`);
    } catch (error) {
      toast.error("Errore nell'aggiornamento delle ferie rimanenti");
      console.error("Error updating days off left:", error);
    } finally {
      setIsSavingLeft(false);
    }
  };

  const handleSavePlanned = async () => {
    if (!allocationsData) return;
    setIsSavingPlanned(true);
    try {
      await updateDaysOff("/api/user/days-off", {
        method: "PATCH",
        body: JSON.stringify({
          userId,
          daysOffLeft: allocationsData.daysOffLeft ?? null,
          daysOffPlanned: daysOffPlanned ?? null,
        }),
      });
      toast.success("Ferie pianificate aggiornate con successo");
      setIsEditingPlanned(false);
      await fetchAllocations(`/api/user/allocations?userId=${userId}`);
    } catch (error) {
      toast.error("Errore nell'aggiornamento delle ferie pianificate");
      console.error("Error updating days off planned:", error);
    } finally {
      setIsSavingPlanned(false);
    }
  };

  const handleReset = async () => {
    try {
      await updateDaysOff("/api/user/days-off", {
        method: "PATCH",
        body: JSON.stringify({
          userId,
          daysOffLeft: null,
          daysOffPlanned: null,
        }),
      });
      toast.success("Valori ripristinati ai valori calcolati");
      setIsEditingLeft(false);
      setIsEditingPlanned(false);
      await fetchAllocations(`/api/user/allocations?userId=${userId}`);
    } catch (error) {
      toast.error("Errore nel ripristino dei valori");
      console.error("Error resetting days off:", error);
    }
  };

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
      <div className="grid gap-4 md:grid-cols-5">
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
            <CardDescription>Fine Allocazione</CardDescription>
            <CardTitle className="text-2xl">
              {allocationsData.latestAllocationEndDate
                ? formatDate(allocationsData.latestAllocationEndDate)
                : "Non definita"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <CardDescription>Ferie Rimanenti</CardDescription>
                {isOwnProfile &&
                  allocationsData.hasCustomValues &&
                  !isEditingLeft && (
                    <span className="text-xs text-muted-foreground mt-1">
                      Valore personalizzato
                    </span>
                  )}
              </div>
              {isOwnProfile && !isEditingLeft && (
                <div className="flex gap-1">
                  {allocationsData.hasCustomValues && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReset}
                      className="h-6 w-6"
                      aria-label="Ripristina valori calcolati"
                      title="Ripristina valori calcolati"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditLeft}
                    className="h-6 w-6"
                    aria-label="Modifica ferie rimanenti"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {isEditingLeft && isOwnProfile ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={daysOffLeft ?? ""}
                    onChange={(e) =>
                      setDaysOffLeft(
                        e.target.value === ""
                          ? null
                          : parseInt(e.target.value, 10)
                      )
                    }
                    className="w-24"
                    min="0"
                  />
                  <span className="text-sm text-muted-foreground">giorni</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveLeft}
                    disabled={isSavingLeft}
                    className="h-7"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Salva
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelLeft}
                    disabled={isSavingLeft}
                    className="h-7"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Annulla
                  </Button>
                </div>
              </div>
            ) : (
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
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <CardDescription>Ferie Pianificate</CardDescription>
                {isOwnProfile &&
                  allocationsData.hasCustomValues &&
                  !isEditingPlanned && (
                    <span className="text-xs text-muted-foreground mt-1">
                      Valore personalizzato
                    </span>
                  )}
              </div>
              {isOwnProfile && !isEditingPlanned && (
                <div className="flex gap-1">
                  {allocationsData.hasCustomValues && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReset}
                      className="h-6 w-6"
                      aria-label="Ripristina valori calcolati"
                      title="Ripristina valori calcolati"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditPlanned}
                    className="h-6 w-6"
                    aria-label="Modifica ferie pianificate"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {isEditingPlanned && isOwnProfile ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={daysOffPlanned ?? ""}
                    onChange={(e) =>
                      setDaysOffPlanned(
                        e.target.value === ""
                          ? null
                          : parseInt(e.target.value, 10)
                      )
                    }
                    className="w-24"
                    min="0"
                  />
                  <span className="text-sm text-muted-foreground">giorni</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSavePlanned}
                    disabled={isSavingPlanned}
                    className="h-7"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Salva
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelPlanned}
                    disabled={isSavingPlanned}
                    className="h-7"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Annulla
                  </Button>
                </div>
              </div>
            ) : (
              <CardTitle className="text-2xl text-blue-600">
                {allocationsData.daysOffPlanned} giorni
              </CardTitle>
            )}
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
