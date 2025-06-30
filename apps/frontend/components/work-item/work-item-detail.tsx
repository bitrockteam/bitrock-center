"use client";

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
import {
  getAllUsers,
  getClientById,
  getProjectById,
  getTimeEntriesByWorkItem,
  getWorkItemById,
} from "@/lib/mock-data";
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

export default function WorkItemDetail({ id }: { id: string }) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const workItem = getWorkItemById(id);
  const client = workItem ? getClientById(workItem.clientId) : null;
  const project = workItem?.projectId
    ? getProjectById(workItem.projectId)
    : null;
  const users = getAllUsers();
  const timeEntries = getTimeEntriesByWorkItem(id);

  if (!workItem) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Commessa non trovata</h2>
        <p className="text-muted-foreground mb-4">
          La commessa richiesta non esiste o è stata rimossa.
        </p>
        <Button onClick={() => router.push("/commesse")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alle Commesse
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Attiva</Badge>;
      case "completed":
        return <Badge variant="outline">Completata</Badge>;
      case "on-hold":
        return <Badge variant="secondary">In Pausa</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "time-material":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Time & Material
          </Badge>
        );
      case "fixed-price":
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

  const enabledUsers = users.filter((user) =>
    workItem.enabledUsers.includes(user.id),
  );
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

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
                  {workItem.startDate} - {workItem.endDate || "In corso"}
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
              Dettagli Economici
            </CardTitle>
            <CardDescription>Informazioni su costi e ore</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workItem.type === "time-material" ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center">
                      <Euro className="mr-2 h-4 w-4" />
                      Tariffa Oraria:
                    </p>
                    <p className="text-sm text-muted-foreground ml-6">
                      €{workItem.hourlyRate}/ora
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Ore Stimate:
                    </p>
                    <p className="text-sm text-muted-foreground ml-6">
                      {workItem.estimatedHours} ore
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Ore Registrate:
                    </p>
                    <p className="text-sm text-muted-foreground ml-6">
                      {totalHours} ore
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center">
                    <Euro className="mr-2 h-4 w-4" />
                    Prezzo Fisso:
                  </p>
                  <p className="text-sm text-muted-foreground ml-6">
                    €{workItem.fixedPrice?.toLocaleString("it-IT")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Team Abilitato</CardTitle>
          <CardDescription>
            Utenti che possono registrare ore su questa commessa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {enabledUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg?height=40&width=40"}
                  />
                  <AvatarFallback>
                    {user.name.charAt(0)}
                    {user.surname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
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
                    <TableHead>Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-muted-foreground"
                      >
                        Nessuna registrazione trovata
                      </TableCell>
                    </TableRow>
                  ) : (
                    timeEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  entry.user.avatar ||
                                  "/placeholder.svg?height=24&width=24"
                                }
                              />
                              <AvatarFallback>
                                {entry.user.name.charAt(0)}
                                {entry.user.surname.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {entry.user.name} {entry.user.surname}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{entry.hours}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              entry.status === "approved"
                                ? "outline"
                                : entry.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {entry.status === "approved"
                              ? "Approvato"
                              : entry.status === "pending"
                                ? "In attesa"
                                : "Rifiutato"}
                          </Badge>
                        </TableCell>
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
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{totalHours}</div>
                  <div className="text-sm text-muted-foreground">
                    Ore Totali
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {enabledUsers.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Utenti Abilitati
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {workItem.type === "time-material" && workItem.hourlyRate
                      ? `€${(totalHours * workItem.hourlyRate).toLocaleString("it-IT")}`
                      : workItem.type === "fixed-price"
                        ? `€${workItem.fixedPrice?.toLocaleString("it-IT")}`
                        : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valore Totale
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog per modificare la commessa */}
      <AddWorkItemDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editData={workItem}
      />
    </motion.div>
  );
}
