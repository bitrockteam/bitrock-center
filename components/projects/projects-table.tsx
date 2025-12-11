"use client";

import { deleteProject } from "@/app/server-actions/project/deleteProject";
import type { Project } from "@/app/server-actions/project/fetchAllProjects";
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
import { Button } from "@/components/ui/button";
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
import type { project } from "@/db";
import { getProjectStatusBadge } from "@/utils/mapping";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Edit, MoreHorizontal, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import AddProjectDialog from "./add-project-dialog";

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [editProjectDialog, setEditProjectDialog] = useState<Project | null>(null);
  const [deleteProjectDialog, setDeleteProjectDialog] = useState<project | null>(null);

  const handleViewProject = (id: string) => {
    router.push(`/progetti/${id}`);
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="relative">
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
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Nessun progetto trovato
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project, index) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="group/row cursor-pointer transition-all duration-300 hover:bg-muted/50 border-b"
                    onClick={() => handleViewProject(project.id)}
                  >
                    <TableCell className="font-medium group-hover/row:text-primary transition-colors">
                      {project?.name}
                    </TableCell>
                    <TableCell className="group-hover/row:text-primary transition-colors">
                      {project?.client.name}
                    </TableCell>
                    <TableCell>{getProjectStatusBadge(project?.status)}</TableCell>

                    <TableCell className="group-hover/row:text-primary transition-colors">
                      {dayjs(project?.start_date).format("MM DD YYYY")}
                    </TableCell>
                    <TableCell className="group-hover/row:text-primary transition-colors">
                      {project?.end_date ? dayjs(project?.end_date).format("MM DD YYYY") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="transition-all duration-300 hover:scale-110"
                          >
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
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
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
            <AlertDialogTitle>Sei sicuro di voler eliminare questo progetto?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il progetto verrà eliminato permanentemente
              dal sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => handleDeleteProject(deleteProjectDialog?.id ?? "")}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
