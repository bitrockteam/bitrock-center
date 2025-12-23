"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronsUpDown,
  Edit,
  Euro,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { WorkItemById } from "@/app/server-actions/work-item/fetchWorkItemById";
import type { FindUsers } from "@/app/server-actions/user/findUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { work_item_status, work_item_type } from "@/db";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { formatDisplayName } from "@/services/users/utils";
import { toast } from "sonner";
import AddWorkItemDialog from "./add-work-item-dialog";

export default function WorkItemDetail({
  workItem: initialWorkItem,
  canEditWorkItem = false,
}: {
  workItem: NonNullable<WorkItemById>;
  canEditWorkItem?: boolean;
}) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [workItem, setWorkItem] = useState<NonNullable<WorkItemById>>(initialWorkItem);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, loading: usersLoading, callApi: fetchUsers } = useApi<FindUsers[]>();
  const { callApi: addAllocationApi, loading: addingAllocation } = useApi();
  const { callApi: removeAllocationApi, loading: removingAllocation } = useApi();

  // Sync local state with prop changes
  useEffect(() => {
    setWorkItem(initialWorkItem);
  }, [initialWorkItem]);

  useEffect(() => {
    if (isPopoverOpen) {
      fetchUsers("/api/user/search");
    }
  }, [isPopoverOpen, fetchUsers]);

  const handleRefresh = async () => {
    // Fetch fresh data
    const response = await fetch(`/api/work-item/${workItem.id}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        setWorkItem(data.data);
      }
    }
    // Refresh server component data
    router.refresh();
  };

  const handleAddEmployee = async () => {
    if (!selectedUserId) {
      toast.error("Seleziona un utente");
      return;
    }

    // Check if user is already in the team
    const isAlreadyAdded = workItem.allocation.some((alloc) => alloc.user_id === selectedUserId);
    if (isAlreadyAdded) {
      toast.error("Questo utente è già nel team");
      return;
    }

    try {
      await addAllocationApi("/api/work-item/add-allocation", {
        method: "POST",
        body: JSON.stringify({
          work_item_id: workItem.id,
          user_id: selectedUserId,
          percentage: 100, // Default percentage
        }),
      });

      // If we get here, the API call was successful (useApi throws on error)
      toast.success("Utente aggiunto al team");
      setSelectedUserId(undefined);
      setSearchQuery("");
      setIsPopoverOpen(false);
      await handleRefresh();
    } catch (error) {
      toast.error("Errore nell'aggiunta dell'utente");
      console.error("Error adding allocation:", error);
    }
  };

  const handleRemoveEmployee = async (userId: string) => {
    try {
      await removeAllocationApi(
        `/api/work-item/remove-allocation?work_item_id=${workItem.id}&user_id=${userId}`,
        {
          method: "DELETE",
        }
      );

      // If we get here, the API call was successful (useApi throws on error)
      toast.success("Utente rimosso dal team");
      await handleRefresh();
    } catch (error) {
      toast.error("Errore nella rimozione dell'utente");
      console.error("Error removing allocation:", error);
    }
  };

  const availableUsers =
    users?.filter((user) => !workItem.allocation.some((alloc) => alloc.user_id === user.id)) || [];

  const filteredUsers = searchQuery
    ? availableUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableUsers;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case work_item_status.active:
        return <Badge className="bg-green-500">Attiva</Badge>;
      case work_item_status.completed:
        return <Badge variant="outline">Completata</Badge>;
      case work_item_status.on_hold:
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
            Time & Material
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

  // Helper function to safely convert date strings to Date objects
  const safeDateString = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return "";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toDateString();
  };

  const project = workItem.project;
  const client = workItem.client;

  const timeEntries = workItem?.timesheet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/commesse")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{workItem.title}</h1>
            <div className="flex items-center space-x-2">
              {getTypeBadge(workItem.type)}
              {getStatusBadge(workItem.status)}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifica Commessa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informazioni Generali</CardTitle>
            <CardDescription>Dettagli della commessa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  Cliente:
                </p>
                <p className="text-sm text-muted-foreground ml-6">{client?.name}</p>
              </div>
              {project && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Progetto:
                  </p>
                  <p className="text-sm text-muted-foreground ml-6">{project.name}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Periodo:
                </p>
                <p className="text-sm text-muted-foreground ml-6">
                  {safeDateString(workItem.start_date)} -{" "}
                  {workItem.end_date ? safeDateString(workItem.end_date) : "In corso"}
                </p>
              </div>
              {workItem.description && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Descrizione:</p>
                  <p className="text-sm text-muted-foreground">{workItem.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informazioni Economiche</CardTitle>
            <CardDescription>Dettagli finanziari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center">
                  <Euro className="mr-2 h-4 w-4" />
                  Tipo di Contratto:
                </p>
                <p className="text-sm text-muted-foreground ml-6">
                  {workItem.type === work_item_type.time_material
                    ? "Time & Material"
                    : "Prezzo Fisso"}
                </p>
              </div>
              {workItem.type === work_item_type.time_material ? (
                <>
                  {workItem.hourly_rate && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tariffa Oraria:</p>
                      <p className="text-sm text-muted-foreground ml-6">
                        €{workItem.hourly_rate}/ora
                      </p>
                    </div>
                  )}
                </>
              ) : (
                workItem.fixed_price && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Prezzo Fisso:</p>
                    <p className="text-sm text-muted-foreground ml-6">
                      €{workItem.fixed_price.toLocaleString("it-IT")}
                    </p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Team</CardTitle>
          <CardDescription>Utenti abilitati a registrare ore su questa commessa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canEditWorkItem && (
            <div className="flex items-center gap-2">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPopoverOpen}
                    className="flex-1 justify-between"
                    disabled={usersLoading || addingAllocation}
                  >
                    {selectedUserId
                      ? users?.find((user) => user.id === selectedUserId)?.name
                      : "Aggiungi utente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Cerca utente..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        {availableUsers.length === 0
                          ? "Tutti gli utenti sono già nel team"
                          : "Nessun utente trovato"}
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.name}
                            onSelect={() => {
                              setSelectedUserId(user.id);
                            }}
                          >
                            <div className="flex items-center space-x-2 flex-1">
                              <Avatar className="h-6 w-6">
                                {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                                <AvatarFallback className="text-xs">
                                  {formatDisplayName({ name: user.name, initials: true })}
                                </AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedUserId === user.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                onClick={handleAddEmployee}
                disabled={!selectedUserId || addingAllocation}
                size="default"
                className="shrink-0"
              >
                {addingAllocation ? "Aggiunta..." : "Aggiungi"}
              </Button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {workItem.allocation?.map((alloc) => (
              <div
                key={alloc.user.id}
                className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 group hover:bg-muted/70 transition-colors"
              >
                <Avatar className="h-6 w-6 shrink-0">
                  {alloc.user.avatar_url && <AvatarImage src={alloc.user.avatar_url} />}
                  <AvatarFallback className="text-xs">
                    {formatDisplayName({ name: alloc.user.name, initials: true })}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{alloc.user.name}</span>
                <span className="text-xs text-muted-foreground">({alloc.percentage}%)</span>
                {canEditWorkItem && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0"
                    onClick={() => handleRemoveEmployee(alloc.user_id)}
                    disabled={removingAllocation}
                    aria-label={`Rimuovi ${alloc.user.name} dal team`}
                    tabIndex={0}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {workItem.allocation?.length === 0 && (
              <p className="text-sm text-muted-foreground">Nessun utente nel team</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timesheet" className="w-full">
        <TabsList>
          <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="timesheet">
          <Card>
            <CardHeader>
              <CardTitle>Ore Registrate</CardTitle>
              <CardDescription>Ore lavorate su questa commessa</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Ore</TableHead>
                    <TableHead>Descrizione</TableHead>
                    {/* <TableHead>Stato</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Nessuna ora registrata
                      </TableCell>
                    </TableRow>
                  ) : (
                    timeEntries?.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{safeDateString(entry.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              {entry.user.avatar_url && <AvatarImage src={entry.user.avatar_url} />}
                              <AvatarFallback className="text-xs">
                                {formatDisplayName({
                                  name: entry.user.name,
                                  initials: true,
                                })}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{entry.user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{entry.hours} ore</TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.description || "-"}
                        </TableCell>
                        {/* <TableCell>
                          <Badge variant="outline">Approvato</Badge>
                        </TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Statistiche e analisi della commessa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Membri del Team</p>
                  <p className="text-2xl font-bold">{workItem.allocation?.length || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Stato</p>
                  <p className="text-2xl font-bold">
                    {workItem.status === work_item_status.active
                      ? "Attiva"
                      : workItem.status === work_item_status.completed
                        ? "Completata"
                        : "In Pausa"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {workItem && (
        <AddWorkItemDialog
          open={showEditDialog}
          canCreateWorkItem={canEditWorkItem}
          onOpenChange={setShowEditDialog}
          editData={{
            title: workItem.title,
            client_id: workItem.client_id,
            project_id: workItem.project_id || "",
            description: workItem.description || "",
            type: workItem.type,
            status: workItem.status,
            hourly_rate: workItem.hourly_rate || 0,
            fixed_price: workItem.fixed_price || 0,
            allocations: workItem.allocation.map((alloc) => ({
              user_id: alloc.user_id,
              percentage: alloc.percentage,
            })),
            id: workItem.id,
            start_date: workItem.start_date
              ? workItem.start_date instanceof Date
                ? workItem.start_date.toISOString().substring(0, 10)
                : new Date(workItem.start_date).toISOString().substring(0, 10)
              : "",
            end_date: workItem.end_date
              ? workItem.end_date instanceof Date
                ? workItem.end_date.toISOString().substring(0, 10)
                : new Date(workItem.end_date).toISOString().substring(0, 10)
              : "",
          }}
        />
      )}
    </motion.div>
  );
}
