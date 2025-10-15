"use client";

import { WorkItemById } from "@/app/server-actions/work-item/fetchWorkItemById";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { work_item_status, work_item_type } from "@/db";
import { formatDisplayName } from "@/services/users/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Edit,
  Euro,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddWorkItemDialog from "./add-work-item-dialog";

export default function WorkItemDetail({
  workItem,
  canEditWorkItem = false,
}: {
  workItem: NonNullable<WorkItemById>;
  canEditWorkItem?: boolean;
}) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case work_item_status.active:
        return <Badge className="bg-green-500">Attiva</Badge>;
      case work_item_status.completed:
        return <Badge variant="outline">Completata</Badge>;
      case work_item_status.on_hold:
        return <Badge variant="secondary">In Pausa</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case work_item_type.time_material:
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Time & Material
          </Badge>
        );
      case work_item_type.fixed_price:
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-500"
          >
            Prezzo Fisso
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  // Helper function to safely convert date strings to Date objects
  const safeDateString = (
    dateValue: string | Date | null | undefined,
  ): string => {
    if (!dateValue) return "";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toDateString();
  };

  const project = workItem.project;
  const client = workItem.client;

  const totalHours = workItem.timesheet.reduce(
    (sum, entry) => sum + entry.hours,
    0,
  );

  const enabledUsers = workItem.work_item_enabled_users;
  const timeEntries = workItem?.timesheet;

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
            onClick={() => router.push("/commesse")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {workItem.title}
            </h1>
            <div className="flex items-center space-x-2">
              {getTypeBadge(workItem.type)}
              {getStatusBadge(workItem.status)}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifica Commessa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Informazioni Generali
            </CardTitle>
            <CardDescription>Dettagli della commessa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  Cliente:
                </p>
                <p className="text-sm text-muted-foreground ml-6">
                  {client?.name}
                </p>
              </div>
              {project && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Progetto:
                  </p>
                  <p className="text-sm text-muted-foreground ml-6">
                    {project.name}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Periodo:
                </p>
                <p className="text-sm text-muted-foreground ml-6">
                  {safeDateString(workItem.start_date)} -{" "}
                  {workItem.end_date
                    ? safeDateString(workItem.end_date)
                    : "In corso"}
                </p>
              </div>
              {workItem.description && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Descrizione:</p>
                  <p className="text-sm text-muted-foreground">
                    {workItem.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Informazioni Economiche
            </CardTitle>
            <CardDescription>Dettagli finanziari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Euro className="mr-2 h-4 w-4" />
                  Tipo di Contratto:
                </p>
                <p className="text-sm text-muted-foreground ml-6">
                  {workItem.type === work_item_type.time_material
                    ? "Time & Material"
                    : "Prezzo Fisso"}
                </p>
              </div>
              {workItem.type === work_item_type.time_material ? (
                <>
                  {workItem.hourly_rate && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tariffa Oraria:</p>
                      <p className="text-sm text-muted-foreground ml-6">
                        €{workItem.hourly_rate}/ora
                      </p>
                    </div>
                  )}
                  {workItem.estimated_hours && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Ore Stimate:</p>
                      <p className="text-sm text-muted-foreground ml-6">
                        {workItem.estimated_hours} ore
                      </p>
                    </div>
                  )}
                </>
              ) : (
                workItem.fixed_price && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Prezzo Fisso:</p>
                    <p className="text-sm text-muted-foreground ml-6">
                      €{workItem.fixed_price.toLocaleString("it-IT")}
                    </p>
                  </div>
                )
              )}
              {totalHours !== undefined && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Ore Totali:
                  </p>
                  <p className="text-sm text-muted-foreground ml-6">
                    {totalHours} ore
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Team</CardTitle>
          <CardDescription>
            Utenti abilitati a registrare ore su questa commessa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {enabledUsers?.map(({ user }) => (
              <div
                key={user.id}
                className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2"
              >
                <Avatar className="h-6 w-6">
                  {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                  <AvatarFallback className="text-xs">
                    {formatDisplayName({ name: user.name, initials: true })}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timesheet" className="w-full">
        <TabsList>
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="timesheet">
          <Card>
            <CardHeader>
              <CardTitle>Ore Registrate</CardTitle>
              <CardDescription>Ore lavorate su questa commessa</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Ore</TableHead>
                    <TableHead>Descrizione</TableHead>
                    {/* <TableHead>Stato</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-muted-foreground"
                      >
                        Nessuna ora registrata
                      </TableCell>
                    </TableRow>
                  ) : (
                    timeEntries?.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{safeDateString(entry.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              {entry.user.avatar_url && (
                                <AvatarImage src={entry.user.avatar_url} />
                              )}
                              <AvatarFallback className="text-xs">
                                {formatDisplayName({
                                  name: entry.user.name,
                                  initials: true,
                                })}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {entry.user.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{entry.hours} ore</TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.description || "-"}
                        </TableCell>
                        {/* <TableCell>
                          <Badge variant="outline">Approvato</Badge>
                        </TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Statistiche e analisi della commessa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Ore Totali</p>
                  <p className="text-2xl font-bold">{totalHours || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Membri del Team</p>
                  <p className="text-2xl font-bold">
                    {enabledUsers?.length || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Stato</p>
                  <p className="text-2xl font-bold">
                    {workItem.status === work_item_status.active
                      ? "Attiva"
                      : workItem.status === work_item_status.completed
                        ? "Completata"
                        : "In Pausa"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {workItem && (
        <AddWorkItemDialog
          open={showEditDialog}
          canCreateWorkItem={canEditWorkItem}
          onOpenChange={setShowEditDialog}
          editData={{
            title: workItem.title,
            client_id: workItem.client_id,
            project_id: workItem.project_id || "",
            description: workItem.description || "",
            type: workItem.type,
            status: workItem.status,
            hourly_rate: workItem.hourly_rate || 0,
            fixed_price: workItem.fixed_price || 0,
            estimated_hours: workItem.estimated_hours || 0,
            enabled_users: workItem.work_item_enabled_users.map(
              (user) => user.user_id,
            ),
            id: workItem.id,
            start_date: workItem.start_date
              ? workItem.start_date instanceof Date
                ? workItem.start_date.toISOString().substring(0, 10)
                : new Date(workItem.start_date).toISOString().substring(0, 10)
              : "",
            end_date: workItem.end_date
              ? workItem.end_date instanceof Date
                ? workItem.end_date.toISOString().substring(0, 10)
                : new Date(workItem.end_date).toISOString().substring(0, 10)
              : "",
          }}
        />
      )}
    </motion.div>
  );
}
