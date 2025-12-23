"use client";

import { getAllClients } from "@/app/server-actions/client/getAllClients";
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
import { useApi } from "@/hooks/useApi";
import { useServerAction } from "@/hooks/useServerAction";
import { motion } from "framer-motion";
import { Building2, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useCallback, useImperativeHandle, useEffect, useState } from "react";
import { toast } from "sonner";
import AddClientDialog from "./add-client-dialog";

export interface ClientsTableRef {
  refresh: () => Promise<void>;
}

interface ClientsTableProps {
  canEditClient: boolean;
}

const ClientsTable = forwardRef<ClientsTableRef, ClientsTableProps>(({ canEditClient }, ref) => {
  const router = useRouter();
  const [editClient, setEditClient] = useState<string>();
  const [deleteClientId, setDeleteClientId] = useState<string>();
  const [isDeleting, setIsDeleting] = useState(false);

  const [clients, getClients] = useServerAction(getAllClients);
  const { callApi: deleteClientApi } = useApi();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Attivo</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inattivo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewClient = (id: string) => {
    router.push(`/clienti/${id}`);
  };

  const handleDeleteClient = async () => {
    if (!deleteClientId) return;

    setIsDeleting(true);
    try {
      await deleteClientApi(`/api/client/delete?id=${deleteClientId}`, {
        method: "DELETE",
      });
      toast.success("Cliente eliminato con successo");
      setDeleteClientId(undefined);
      await getClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Errore durante l'eliminazione del cliente");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClientSuccess = async () => {
    await getClients();
  };

  const refreshClients = useCallback(async () => {
    await getClients();
  }, [getClients]);

  useImperativeHandle(
    ref,
    () => ({
      refresh: refreshClients,
    }),
    [refreshClients]
  );

  useEffect(() => {
    getClients();
  }, [getClients]);

  return (
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Codice</TableHead>
                  <TableHead>Contatto</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nessun cliente trovato
                    </TableCell>
                  </TableRow>
                ) : (
                  clients?.map((client, index) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="group/row cursor-pointer transition-all duration-300 hover:bg-muted/50 border-b"
                      onClick={() => handleViewClient(client.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground group-hover/row:text-primary transition-colors" />
                          <span className="group-hover/row:text-primary transition-colors">
                            {client.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.code}</Badge>
                      </TableCell>
                      <TableCell className="group-hover/row:text-primary transition-colors">
                        {client.contact_person}
                      </TableCell>
                      <TableCell className="group-hover/row:text-primary transition-colors">
                        {client.email}
                      </TableCell>
                      <TableCell className="group-hover/row:text-primary transition-colors">
                        {client.phone}
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
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
                                handleViewClient(client.id);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Visualizza</span>
                            </DropdownMenuItem>
                            {canEditClient && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditClient(client.id);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Modifica</span>
                              </DropdownMenuItem>
                            )}
                            {canEditClient && (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteClientId(client.id);
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

      {/* Dialog per modificare un cliente */}
      {editClient && (
        <AddClientDialog
          open={!!editClient}
          onOpenChange={(open) => !open && setEditClient(undefined)}
          editData={clients?.find((c) => c.id === editClient)}
          onSuccess={handleClientSuccess}
        />
      )}

      {/* Dialog di conferma eliminazione */}
      <AlertDialog
        open={!!deleteClientId}
        onOpenChange={(open) => !open && setDeleteClientId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questo cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il cliente verrà eliminato permanentemente dal
              sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteClient}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminazione..." : "Elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
});

ClientsTable.displayName = "ClientsTable";

export default ClientsTable;
