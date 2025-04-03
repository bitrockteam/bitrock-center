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
  getLeaveRequestsByUser,
  getProjectsByUser,
  getTimeEntriesByUser,
  getUserById,
} from "@/lib/mock-data";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  Edit,
  Mail,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddUserDialog from "./add-user-dialog";

export default function UserDetail({ id }: { id: string }) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const user = getUserById(id);
  const timeEntries = getTimeEntriesByUser(id);
  const leaveRequests = getLeaveRequestsByUser(id);
  const projects = getProjectsByUser(id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Utente non trovato</h2>
        <p className="text-muted-foreground mb-4">
          L&apos;utente richiesto non esiste o è stato rimosso.
        </p>
        <Button onClick={() => router.push("/utenti")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna agli Utenti
        </Button>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Amministratore</Badge>;
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>;
      case "developer":
        return <Badge variant="outline">Sviluppatore</Badge>;
      case "designer":
        return (
          <Badge variant="outline" className="border-pink-500 text-pink-500">
            Designer
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  // Calcola il totale delle ore lavorate
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
            onClick={() => router.push("/utenti")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.avatar || "/placeholder.svg?height=64&width=64"}
            />
            <AvatarFallback>
              {user.name.charAt(0)}
              {user.surname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user.name} {user.surname}
            </h1>
            <div className="flex items-center space-x-2">
              {getRoleBadge(user.role)}
              <Badge
                variant={user.active ? "outline" : "secondary"}
                className={user.active ? "border-green-500 text-green-500" : ""}
              >
                {user.active ? "Attivo" : "Inattivo"}
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifica Utente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Informazioni Contatto
            </CardTitle>
            <CardDescription>Dettagli dell&apos;utente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Email:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Mail className="mr-1 h-3 w-3" /> {user.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Telefono:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Phone className="mr-1 h-3 w-3" />{" "}
                  {user.phone || "Non disponibile"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Ruolo:</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Ore Totali:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-3 w-3" /> {totalHours} ore
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Progetti Attivi:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Briefcase className="mr-1 h-3 w-3" /> {projects.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Progetti Assegnati
            </CardTitle>
            <CardDescription>
              Progetti a cui l&apos;utente sta lavorando
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Briefcase className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nessun progetto assegnato
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-2 p-4 border rounded-md cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/progetti/${project.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge
                        variant={
                          project.status === "active"
                            ? "default"
                            : project.status === "completed"
                              ? "outline"
                              : project.status === "on-hold"
                                ? "secondary"
                                : "outline"
                        }
                        className={
                          project.status === "planned"
                            ? "border-amber-500 text-amber-500"
                            : ""
                        }
                      >
                        {project.status === "active"
                          ? "Attivo"
                          : project.status === "completed"
                            ? "Completato"
                            : project.status === "on-hold"
                              ? "In Pausa"
                              : "Pianificato"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.client}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="inline-block mr-1 h-3 w-3" />{" "}
                      {project.startDate}{" "}
                      {project.endDate ? `- ${project.endDate}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timesheet" className="w-full">
        <TabsList>
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="leave">Ferie e Permessi</TabsTrigger>
        </TabsList>
        <TabsContent value="timesheet">
          <Card>
            <CardHeader>
              <CardTitle>Ore Registrate</CardTitle>
              <CardDescription>Ore lavorate dall&apos;utente</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Progetto</TableHead>
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
                        <TableCell>{entry.project.name}</TableCell>
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
        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>Ferie e Permessi</CardTitle>
              <CardDescription>
                Richieste di ferie e permessi dell&apos;utente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Giorni</TableHead>
                    <TableHead>Motivazione</TableHead>
                    <TableHead>Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-muted-foreground"
                      >
                        Nessuna richiesta trovata
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaveRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {request.type === "vacation"
                            ? "Ferie"
                            : request.type === "permission"
                              ? "Permesso"
                              : request.type === "sickness"
                                ? "Malattia"
                                : request.type}
                        </TableCell>
                        <TableCell>{request.period}</TableCell>
                        <TableCell>{request.days}</TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "outline"
                                : request.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {request.status === "approved"
                              ? "Approvato"
                              : request.status === "pending"
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
      </Tabs>

      {/* Dialog per modificare l'utente */}
      <AddUserDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editData={user}
      />
    </motion.div>
  );
}
