"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Edit, MoreHorizontal, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddProjectDialog from "./add-project-dialog";
import { useSessionContext } from "@/app/utenti/SessionData";
import { format } from "date-fns";
import { useDeleteProject } from "@/api/useDeleteProject";
import { IProject } from "@bitrock/types";

export default function ProjectsTable() {
  const router = useRouter();
  const [editProjectDialog, setEditProjectDialog] = useState<IProject | null>(
    null,
  );
  const [deleteProjectDialog, setDeleteProjectDialog] =
    useState<IProject | null>(null);

  const { refetchProjects } = useSessionContext();

  const { projects } = useSessionContext();

  const { deleteProject } = useDeleteProject();

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

  const handleViewProject = (id: string) => {
    router.push(`/progetti/${id}`);
  };

  const handleDeleteProject = async (id: string) => {
    const success = await deleteProject(id);
    if (success) {
      refetchProjects();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Data Inizio</TableHead>
                  <TableHead>Data Fine</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nessun progetto trovato
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewProject(project.id)}
                    >
                      <TableCell className="font-medium">
                        {project?.name}
                      </TableCell>
                      <TableCell>{project?.client}</TableCell>
                      <TableCell>
                        {getStatusBadge(project?.status.id)}
                      </TableCell>

                      <TableCell>
                        {format(project?.start_date, "MM dd yyyy")}
                      </TableCell>
                      <TableCell>
                        {project?.end_date
                          ? format(project?.end_date, "MM dd yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProject(project.id);
                              }}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              <span>Visualizza</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditProjectDialog(project);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifica</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteProjectDialog(project);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Elimina</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog per modificare un progetto */}
      {editProjectDialog && (
        <AddProjectDialog
          open={!!editProjectDialog}
          onOpenChange={(open) => !open && setEditProjectDialog(null)}
          editData={editProjectDialog}
        />
      )}

      {/* Dialog di conferma eliminazione */}
      <AlertDialog
        open={!!deleteProjectDialog}
        onOpenChange={(open) => !open && setDeleteProjectDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Sei sicuro di voler eliminare questo progetto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il progetto verrà
              eliminato permanentemente dal sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => handleDeleteProject(deleteProjectDialog!.id)}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
