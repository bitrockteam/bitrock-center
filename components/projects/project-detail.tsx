"use client";

import type { UserAllocated } from "@/app/server-actions/project/fetchAllocationsForProject";
import type { ProjectById } from "@/app/server-actions/project/fetchProjectById";
import type { FindUsers } from "@/app/server-actions/user/findUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { work_item_type } from "@/db";
import { formatDisplayName } from "@/services/users/utils";
import {
  getProjectStatusBadge,
  getWorkItemStatusBadge,
  getWorkItemTypeBadge,
} from "@/utils/mapping";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Edit, Euro, GanttChart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddProjectDialog from "./add-project-dialog";
import { AddProjectMemberDialog } from "./add-project-member-dialog";

export default function ProjectDetail({
  id,
  canAllocateResources,
  canEditProject,
  project,
  allocations,
  canSeeUsersTimesheets = false,
  users,
}: Readonly<{
  id: string;
  canEditProject?: boolean;
  canAllocateResources?: boolean;
  project: ProjectById;
  allocations: UserAllocated[];
  canSeeUsersTimesheets?: boolean;
  users: FindUsers[];
}>) {
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

  const workItems = project?.work_items;
  const allAllocatedUsers = allocations?.flatMap((all) => all.work_item_enabled_users);

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
          <Button variant="outline" size="icon" onClick={() => router.push("/progetti")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-muted-foreground">Cliente: {project.client.name}</p>
              {getProjectStatusBadge(project.status)}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" onClick={() => router.push(`/progetti/${id}/plan`)}>
              <GanttChart className="mr-2 h-4 w-4" />
              Vai al Piano
            </Button>
          </motion.div>
          {canEditProject && (
            <Button onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifica Progetto
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informazioni Progetto</CardTitle>
            <CardDescription>Dettagli e date del progetto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Descrizione:</p>
                <p className="text-sm text-muted-foreground">{project.description}</p>
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
                    {project?.end_date ? format(project?.end_date, "MM dd yyyy") : "Non definita"}
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
      </div>

      <Tabs defaultValue="commesse" className="w-full">
        <TabsList>
          <TabsTrigger value="commesse">Commesse</TabsTrigger>
          <TabsTrigger value="teams">Team</TabsTrigger>
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="tasks">Attività</TabsTrigger>
        </TabsList>
        <TabsContent value="commesse">
          <Card>
            <CardHeader>
              <CardTitle>Commesse del Progetto</CardTitle>
              <CardDescription>Attività lavorative associate a questo progetto</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titolo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Valore</TableHead>
                    <TableHead>Team</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workItems?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nessuna commessa associata
                      </TableCell>
                    </TableRow>
                  ) : (
                    workItems?.map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/commesse/${item.id}`)}
                      >
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{getWorkItemTypeBadge(item.type)}</TableCell>
                        <TableCell>{getWorkItemStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {item.start_date.toDateString()} -{" "}
                            {item.end_date?.toDateString() || "In corso"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            {item.type === work_item_type.fixed_price ? (
                              <>
                                <Euro className="mr-1 h-3 w-3" />
                                {item.fixed_price?.toLocaleString("it-IT")}
                              </>
                            ) : (
                              <>
                                <Clock className="mr-1 h-3 w-3" />€{item.hourly_rate}/h
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {item.work_item_enabled_users.slice(0, 3).map(({ user_id }) => {
                              const user = users?.find((u) => u.id === user_id);
                              return (
                                <Avatar
                                  key={user_id}
                                  className="h-6 w-6 border-2 border-background"
                                >
                                  <AvatarImage
                                    src={user?.avatar_url || "/placeholder.svg?height=24&width=24"}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {formatDisplayName({
                                      name: user?.name || "Utente",
                                      initials: true,
                                    })}
                                  </AvatarFallback>
                                </Avatar>
                              );
                            })}
                            {item.work_item_enabled_users.length > 3 && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                +{item.work_item_enabled_users.length - 3}
                              </div>
                            )}
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
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>Sviluppatori del team</CardDescription>
                </div>
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
                    <TableHead>Commessa</TableHead>
                    {canAllocateResources && <TableHead>{""}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workItems?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nessuna registrazione trovata
                      </TableCell>
                    </TableRow>
                  ) : (
                    allAllocatedUsers?.map((entry) => (
                      <TableRow
                        key={`${entry?.user_id} ${entry?.work_item_id}`}
                        onClick={() => {
                          if (!canSeeUsersTimesheets) return;

                          router.push(`/progetti/${id}/consuntivazione/${entry?.user_id}`);
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={entry?.user_id ?? "/placeholder.svg?height=24&width=24"}
                              />
                              <AvatarFallback>
                                {formatDisplayName({
                                  name: entry?.user.name ?? "",
                                  initials: true,
                                })}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {formatDisplayName({
                                name: entry?.user.name ?? "",
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{entry?.user.role}</TableCell>
                        <TableCell>
                          {workItems?.find((wi) => wi.id === entry?.work_item_id)?.start_date
                            ? format(
                                workItems?.find((wi) => wi.id === entry?.work_item_id)
                                  ?.start_date ?? "",
                                "dd-MM-yyyy"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {workItems?.find((wi) => wi.id === entry?.work_item_id)?.end_date
                            ? format(
                                workItems?.find((wi) => wi.id === entry?.work_item_id)?.end_date ??
                                  "",
                                "dd-MM-yyyy"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {workItems?.find((wi) => wi.id === entry?.work_item_id)?.title}
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
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
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
                <p className="text-muted-foreground">Nessuna attività disponibile</p>
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
        refetch={() => {
          // todo
          console.info("Refetching allocations...");
        }}
        isEdit={isEditMode}
        initialData={editedMember}
      />
    </motion.div>
  );
}
