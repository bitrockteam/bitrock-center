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

import { useServerAction } from "@/hooks/useServerAction";
import { getAllClients } from "@/server/client/getAllClients";
import { motion } from "framer-motion";
import { Building2, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddClientDialog from "./add-client-dialog";

export default function ClientsTable() {
  const router = useRouter();
  const [editClient, setEditClient] = useState<string>();
  const [deleteClient, setDeleteClient] = useState<string>();

  const [clients, getClients] = useServerAction(getAllClients);

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

  useEffect(() => {
    getClients();
  }, [getClients]);

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
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nessun cliente trovato
                    </TableCell>
                  </TableRow>
                ) : (
                  clients?.map((client) => (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewClient(client.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.code}</Badge>
                      </TableCell>
                      <TableCell>{client.contact_person}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
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
                                handleViewClient(client.id);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Visualizza</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditClient(client.id);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifica</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteClient(client.id);
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

      {/* Dialog per modificare un cliente */}
      {editClient && (
        <AddClientDialog
          open={!!editClient}
          onOpenChange={(open) => !open && setEditClient(undefined)}
          editData={clients?.find((c) => c.id === editClient)}
        />
      )}

      {/* Dialog di conferma eliminazione */}
      <AlertDialog
        open={!!deleteClient}
        onOpenChange={(open) => !open && setDeleteClient(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Sei sicuro di voler eliminare questo cliente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il cliente verrà eliminato
              permanentemente dal sistema.
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
  );
}
