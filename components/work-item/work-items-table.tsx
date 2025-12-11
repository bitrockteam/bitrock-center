"use client";

import type { GetAllClientsResponse } from "@/app/server-actions/client/getAllClients";
import type { WorkItem } from "@/app/server-actions/work-item/fetchAllWorkItems";
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
import { work_item_type, type work_items } from "@/db";
import { useApi } from "@/hooks/useApi";
import { motion } from "framer-motion";
import { Clock, Edit, Euro, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AddWorkItemDialog from "./add-work-item-dialog";
import WorkItemsHeader from "./work-items-header";

export default function WorkItemsTable({
  workItems,
  allClients,
  canCreateWorkItem = false,
  canEditWorkItem = false,
}: {
  workItems: WorkItem[];
  allClients: GetAllClientsResponse[];
  canCreateWorkItem?: boolean;
  canEditWorkItem?: boolean;
}) {
  const router = useRouter();
  const [editWorkItem, setEditWorkItem] = useState<WorkItem | null>(null);
  const [deleteWorkItem, setDeleteWorkItem] = useState<WorkItem | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { callApi: deleteWorkItemApi } = useApi();

  const filteredWorkItems = clientFilter
    ? workItems?.filter((item) => item.client_id === clientFilter)
    : workItems;

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
      case work_item_type.time_material:
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            T&M
          </Badge>
        );
      case work_item_type.fixed_price:
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
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

  const handleDeleteWorkItem = async () => {
    if (!deleteWorkItem) return;

    setIsDeleting(true);
    try {
      await deleteWorkItemApi(`/api/work-item/delete?id=${deleteWorkItem.id}`, {
        method: "DELETE",
      });
      toast.success("Commessa eliminata con successo");
      setDeleteWorkItem(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting work item:", error);
      toast.error("Errore durante l'eliminazione");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to safely convert date strings to Date objects
  const safeDateString = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return "";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toISOString().substring(0, 10);
  };

  return (
    <div className="space-y-6">
      <WorkItemsHeader
        onClientFilter={setClientFilter}
        allClients={allClients}
        canCreateWorkItem={canCreateWorkItem}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardContent className="relative p-0">
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
                  {filteredWorkItems?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        Nessuna commessa trovata
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWorkItems?.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className="group/row cursor-pointer transition-all duration-300 hover:bg-muted/50 border-b"
                        onClick={() => handleViewWorkItem(item.id)}
                      >
                        <TableCell className="font-medium group-hover/row:text-primary transition-colors">
                          {item.title}
                        </TableCell>
                        <TableCell className="group-hover/row:text-primary transition-colors">
                          {item.client.name}
                        </TableCell>
                        <TableCell>
                          {item.project_id ? (
                            <span className="text-sm group-hover/row:text-primary transition-colors">
                              {item.project?.name}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Nessun progetto</span>
                          )}
                        </TableCell>
                        <TableCell>{getTypeBadge(item.type)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {(item.work_item_enabled_users ?? [])
                              .slice(0, 3)
                              .map(({ user, user_id }) => {
                                return (
                                  <Avatar
                                    key={user_id}
                                    className="h-6 w-6 border-2 border-background group-hover/row:ring-primary/20 transition-all"
                                  >
                                    {user?.avatar_url && <AvatarImage src={user.avatar_url} />}
                                    <AvatarFallback className="text-xs">
                                      {user?.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                );
                              })}
                            {(item.work_item_enabled_users.length ?? 0) > 3 && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                +
                                {((
                                  item as work_items & {
                                    enabled_users?: string[];
                                  }
                                ).enabled_users?.length ?? 0) - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm group-hover/row:text-primary transition-colors">
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
                              {canEditWorkItem && (
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
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
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
            canCreateWorkItem={canEditWorkItem}
            onOpenChange={(open) => !open && setEditWorkItem(null)}
            editData={
              editWorkItem
                ? {
                    id: editWorkItem.id,
                    title: editWorkItem.title,
                    client_id: editWorkItem.client_id ?? "",
                    type: editWorkItem.type,
                    status: editWorkItem.status,
                    enabled_users: editWorkItem.work_item_enabled_users.map((user) => user.user_id),
                    start_date: safeDateString(editWorkItem.start_date),
                    end_date: safeDateString(editWorkItem.end_date),
                    project_id: editWorkItem.project_id ?? "",
                    description: editWorkItem.description ?? "",
                    hourly_rate: editWorkItem.hourly_rate,
                    estimated_hours: editWorkItem.estimated_hours,
                    fixed_price: editWorkItem.fixed_price,
                  }
                : undefined
            }
          />
        )}

        {/* Dialog di conferma eliminazione */}
        <AlertDialog
          open={!!deleteWorkItem}
          onOpenChange={(open) => !open && setDeleteWorkItem(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sei sicuro di voler eliminare questa commessa?</AlertDialogTitle>
              <AlertDialogDescription>
                Questa azione non può essere annullata. La commessa verrà eliminata permanentemente
                dal sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Annulla</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground"
                onClick={handleDeleteWorkItem}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminazione..." : "Elimina"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}
