"use client";

import { useGetAllocationsForProject } from "@/api/useGetAllocationsForProject";
import { useGetProjectById } from "@/api/useGetProjectsById";
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
import { formatDisplayName } from "@/services/users/utils";
import { format, parse } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Pencil,
  PlusIcon,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "../custom/Loader";
import AddProjectDialog from "./add-project-dialog";
import { AddProjectMemberDialog } from "./add-project-member-dialog";
import { DeleteAllocationDialog } from "./delete-allocation-dialog";

export default function ProjectDetail({ id }: Readonly<{ id: string }>) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMember, setEditedMember] = useState<{
    user_id: string;
    percentage?: number;
    start_date?: Date;
    end_date?: Date;
  }>({
    user_id: "",
  });
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletedMemberId, setDeletedMemberId] = useState<string | null>(null);

  const { project, isLoading } = useGetProjectById(id);
  const { allocations: timeEntries, fetchAllocations } =
    useGetAllocationsForProject(id);

  if (isLoading)
    return (
      <div className="w-full h-full flex flex-row justify-center items-center">
        <Loader transparent color="black" />
      </div>
    );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Progetto non trovato</h2>
        <p className="text-muted-foreground mb-4">
          Il progetto richiesto non esiste o è stato rimosso.
        </p>
        <Button onClick={() => router.push("/progetti")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna ai Progetti
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Attivo</Badge>;
      case "completed":
        return <Badge variant="outline">Completato</Badge>;
      case "on-hold":
        return <Badge variant="secondary">In Pausa</Badge>;
      case "planned":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Pianificato
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Calcola il totale delle ore lavorate sul progetto
  const totalHours = 40;

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
            onClick={() => router.push("/progetti")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <div className="flex items-center space-x-2">
              <p className="text-muted-foreground">Cliente: {project.client}</p>
              {getStatusBadge(project.status.id)}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifica Progetto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Informazioni Progetto
            </CardTitle>
            <CardDescription>Dettagli e date del progetto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Descrizione:</p>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Data Inizio:</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />{" "}
                    {format(project?.start_date, "MM dd yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Data Fine:</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />{" "}
                    {project?.end_date
                      ? format(project?.end_date, "MM dd yyyy")
                      : "Non definita"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Ore Totali:</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-3 w-3" /> {totalHours} ore
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Team di Progetto
            </CardTitle>
            <CardDescription>Membri assegnati al progetto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.team.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        member.avatar || "/placeholder.svg?height=40&width=40"
                      }
                    />
                    <AvatarFallback>
                      {member.name.charAt(0)}
                      {member.surname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.name} {member.surname}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList>
          <TabsTrigger value="teams">Team</TabsTrigger>
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="tasks">Attività</TabsTrigger>
        </TabsList>
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>Sviluppatori del team</CardDescription>
                </div>
                <Button onClick={() => setShowAddMemberDialog(true)}>
                  <PlusIcon />
                  Aggiungi Membro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utente</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead>Data Inizio</TableHead>
                    <TableHead>Data Fine</TableHead>
                    <TableHead>Percentuale Allocazione</TableHead>
                    <TableHead>{""}</TableHead>
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
                    timeEntries?.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  entry.user_avatar_url ||
                                  "/placeholder.svg?height=24&width=24"
                                }
                              />
                              <AvatarFallback>
                                {formatDisplayName({
                                  name: entry.user_name,
                                  initials: true,
                                })}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {formatDisplayName({ name: entry.user_name })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{entry.user_role.label}</TableCell>
                        <TableCell>
                          {entry.start_date
                            ? format(entry.start_date, "dd-MM-yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {entry.end_date
                            ? format(entry.end_date, "dd-MM-yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell>{entry.percentage}</TableCell>
                        <TableCell>
                          <div className="flex flex-row items-center gap-2">
                            <Button
                              variant="ghost"
                              className="cursor-pointer"
                              size="icon"
                              onClick={() => {
                                console.log({
                                  startDate: entry.start_date
                                    ? parse(
                                        format(entry.start_date, "dd-MM-yyyy"),
                                        "dd-MM-yyyy",
                                        new Date(),
                                      )
                                    : undefined,
                                  startDate2: entry.start_date,
                                });

                                setEditedMember({
                                  user_id: entry.user_id,
                                  percentage: entry.percentage ?? 100,
                                  start_date: entry.start_date
                                    ? parse(
                                        format(entry.start_date, "dd-MM-yyyy"),
                                        "dd-MM-yyyy",
                                        new Date(),
                                      )
                                    : undefined,
                                  end_date: entry.end_date
                                    ? parse(
                                        format(entry.end_date, "dd-MM-yyyy"),
                                        "dd-MM-yyyy",
                                        new Date(),
                                      )
                                    : undefined,
                                });
                                setIsEditMode(true);
                                setShowAddMemberDialog(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="cursor-pointer"
                              size="icon"
                              onClick={() => {
                                setDeletedMemberId(entry.user_id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timesheet">
          <Card>
            <CardHeader>
              <CardTitle>Ore Registrate</CardTitle>
              <CardDescription>Ore lavorate su questo progetto</CardDescription>
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
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nessuna registrazione trovata
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Attività</CardTitle>
              <CardDescription>Attività associate al progetto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nessuna attività disponibile
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog per modificare il progetto */}
      <AddProjectDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editData={project}
        projectId={id}
      />
      <AddProjectMemberDialog
        open={showAddMemberDialog}
        onOpenChange={() => {
          setShowAddMemberDialog(false);
          setIsEditMode(false);
          setEditedMember({ user_id: "" });
        }}
        projectId={id}
        refetch={fetchAllocations}
        isEdit={isEditMode}
        initialData={editedMember}
      />
      <DeleteAllocationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        project_id={project.id}
        user_id={deletedMemberId ?? ""}
        refetch={fetchAllocations}
      />
    </motion.div>
  );
}
