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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  getAllClients,
  getAllUsers,
  getAllWorkItems,
  getProjectById,
} from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Clock, Edit, Euro, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddWorkItemDialog from "./add-work-item-dialog";
import WorkItemsHeader from "./work-items-header";

export default function WorkItemsTable() {
  const router = useRouter();
  const [editWorkItem, setEditWorkItem] = useState<any>(null);
  const [deleteWorkItem, setDeleteWorkItem] = useState<any>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);

  const allWorkItems = getAllWorkItems();
  const clients = getAllClients();
  const users = getAllUsers();

  const workItems = clientFilter
    ? allWorkItems.filter((item) => item.clientId === clientFilter)
    : allWorkItems;

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
            T&M
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

  const handleViewWorkItem = (id: string) => {
    router.push(`/commesse/${id}`);
  };

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || "N/A";
  };

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return null;
    return getProjectById(projectId)?.name || "N/A";
  };

  return (
    <div className="space-y-6">
      <WorkItemsHeader onClientFilter={setClientFilter} />

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
                    <TableHead>Titolo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Progetto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Valore</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 text-muted-foreground"
                      >
                        Nessuna commessa trovata
                      </TableCell>
                    </TableRow>
                  ) : (
                    workItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewWorkItem(item.id)}
                      >
                        <TableCell className="font-medium">
                          {item.title}
                        </TableCell>
                        <TableCell>{getClientName(item.clientId)}</TableCell>
                        <TableCell>
                          {item.projectId ? (
                            <span className="text-sm">
                              {getProjectName(item.projectId)}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Nessun progetto
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getTypeBadge(item.type)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {item.enabledUsers
                              .slice(0, 3)
                              .map((userId, index) => {
                                const user = users.find((u) => u.id === userId);
                                return (
                                  <Avatar
                                    key={index}
                                    className="h-6 w-6 border-2 border-background"
                                  >
                                    <AvatarImage
                                      src={
                                        user?.avatar ||
                                        "/placeholder.svg?height=24&width=24"
                                      }
                                    />
                                    <AvatarFallback className="text-xs">
                                      {user?.name.charAt(0)}
                                      {user?.surname.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                );
                              })}
                            {item.enabledUsers.length > 3 && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                +{item.enabledUsers.length - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            {item.type === "fixed-price" ? (
                              <>
                                <Euro className="mr-1 h-3 w-3" />
                                {item.fixedPrice?.toLocaleString("it-IT")}
                              </>
                            ) : (
                              <>
                                <Clock className="mr-1 h-3 w-3" />€
                                {item.hourlyRate}/h
                              </>
                            )}
                          </div>
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
                                  handleViewWorkItem(item.id);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Visualizza</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditWorkItem(item);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Modifica</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteWorkItem(item);
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

        {/* Dialog per modificare una commessa */}
        {editWorkItem && (
          <AddWorkItemDialog
            open={!!editWorkItem}
            onOpenChange={(open) => !open && setEditWorkItem(null)}
            editData={editWorkItem}
          />
        )}

        {/* Dialog di conferma eliminazione */}
        <AlertDialog
          open={!!deleteWorkItem}
          onOpenChange={(open) => !open && setDeleteWorkItem(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Sei sicuro di voler eliminare questa commessa?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Questa azione non può essere annullata. La commessa verrà
                eliminata permanentemente dal sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground">
                Elimina
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}
