"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit, Mail, MapPin, Phone, PlusCircle, User, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { findClientById } from "@/app/server-actions/client/findClientById";
import { Badge } from "@/components/ui/badge";
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
import { ProjectStatus } from "@/db";
import { Loader } from "@/components/custom/loader/Loader";
import { useServerAction } from "@/hooks/useServerAction";
import AddClientDialog from "./add-client-dialog";
import AddWorkItemDialog from "@/components/work-item/add-work-item-dialog";
import AddProjectDialog from "@/components/projects/add-project-dialog";

export default function ClientDetail({
  id,
  canEditClient,
}: {
  id: string;
  canEditClient?: boolean;
}) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddWorkItemDialog, setShowAddWorkItemDialog] = useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [client, getClient, isPending] = useServerAction(findClientById);

  const projects = client?.project;
  const workItems = client?.work_items;

  useEffect(() => {
    setHasStartedLoading(true);
    getClient(id);
  }, [getClient, id]);

  // Mostra il loader durante il caricamento (isPending è true) o prima di iniziare il caricamento
  if (isPending || !hasStartedLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader />
      </div>
    );
  }

  // Solo dopo che il caricamento è completato (isPending è false e abbiamo iniziato), controlla se il cliente esiste
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Cliente non trovato</h2>
        <p className="text-muted-foreground mb-4">
          Il cliente richiesto non esiste o è stato rimosso.
        </p>
        <Button onClick={() => router.push("/clienti")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna ai Clienti
        </Button>
      </div>
    );
  }

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

  const getWorkItemStatusBadge = (status: string) => {
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

  const getWorkItemTypeBadge = (type: string) => {
    switch (type) {
      case "time-material":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            T&M
          </Badge>
        );
      case "fixed-price":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            Prezzo Fisso
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/clienti")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{client.code}</Badge>
              {getStatusBadge(client.status)}
            </div>
          </div>
        </div>
        {canEditClient && (
          <Button onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifica Cliente
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informazioni Cliente</CardTitle>
            <CardDescription>Dettagli e contatti del cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Persona di Contatto:
                </p>
                <p className="text-sm text-muted-foreground ml-6">{client.contact_person}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email:
                </p>
                <p className="text-sm text-muted-foreground ml-6">{client.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Telefono:
                </p>
                <p className="text-sm text-muted-foreground ml-6">{client.phone}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Indirizzo:
                </p>
                <p className="text-sm text-muted-foreground ml-6">{client.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dati Fiscali</CardTitle>
            <CardDescription>Informazioni fiscali e amministrative</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Partita IVA:</p>
                <p className="text-sm text-muted-foreground">{client.vat_number}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Data Creazione:</p>
                <p className="text-sm text-muted-foreground">{client.created_at.toDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {client.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Note
            </CardTitle>
            <CardDescription>Note aggiuntive sul cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Progetti</TabsTrigger>
          <TabsTrigger value="workitems">Commesse</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Progetti del Cliente</CardTitle>
                  <CardDescription>Progetti associati a questo cliente</CardDescription>
                </div>
                <Button onClick={() => setShowAddProjectDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuovo Progetto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Data Inizio</TableHead>
                    <TableHead>Data Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nessun progetto trovato
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects?.map((project) => (
                      <TableRow
                        key={project.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/progetti/${project.id}`)}
                      >
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              project.status === ProjectStatus.ACTIVE
                                ? "bg-green-500"
                                : project.status === ProjectStatus.COMPLETED
                                  ? ""
                                  : "bg-yellow-500"
                            }
                            variant={
                              project.status === ProjectStatus.COMPLETED ? "outline" : "default"
                            }
                          >
                            {project.status === ProjectStatus.ACTIVE
                              ? "Attivo"
                              : project.status === ProjectStatus.COMPLETED
                                ? "Completato"
                                : project.status === ProjectStatus.PAUSED
                                  ? "In Pausa"
                                  : "Pianificato"}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.start_date.toDateString()}</TableCell>
                        <TableCell>{project.end_date?.toDateString() || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workitems">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commesse del Cliente</CardTitle>
                  <CardDescription>Attività lavorative associate a questo cliente</CardDescription>
                </div>
                <Button onClick={() => setShowAddWorkItemDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuova Commessa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titolo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Data Inizio</TableHead>
                    <TableHead>Data Fine</TableHead>
                    <TableHead>Progetto</TableHead>
                    <TableHead>Team</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workItems?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nessuna commessa trovata
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
                        <TableCell>{item.start_date.toDateString()}</TableCell>
                        <TableCell>{item.end_date?.toDateString() || "-"}</TableCell>
                        <TableCell>
                          {item.project_id ? (
                            <span className="text-sm">
                              {projects?.find((p) => p.id === item.project_id)?.name || "N/A"}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Nessun progetto</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.allocation.length ? (
                            <span className="text-sm">{item.allocation.length} membri</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Nessun team</span>
                          )}
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

      {/* Dialog per modificare il cliente */}
      <AddClientDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editData={client}
        onSuccess={() => {
          getClient(id);
        }}
      />

      {/* Dialog per creare nuova commessa */}
      <AddWorkItemDialog
        open={showAddWorkItemDialog}
        onOpenChange={setShowAddWorkItemDialog}
        presetClientId={client?.id}
        onSuccess={() => {
          getClient(id);
        }}
        canCreateWorkItem={true}
      />

      {/* Dialog per creare nuovo progetto */}
      <AddProjectDialog
        open={showAddProjectDialog}
        onOpenChange={setShowAddProjectDialog}
        presetClientId={client?.id}
        onSuccess={() => {
          getClient(id);
        }}
      />
    </motion.div>
  );
}
