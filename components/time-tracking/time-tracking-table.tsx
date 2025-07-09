"use client";

import { UserTimesheet } from "@/app/server-actions/timesheet/fetchUserTimesheet";
import { WorkItem } from "@/app/server-actions/work-item/fetchAllWorkItems";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { user } from "@/db";
import { useTimesheetApi } from "@/hooks/useTimesheetApi";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import AddHoursDialog from "./add-hours-dialog";

export default function TimeTrackingTable({
  user,
  work_items,
  timesheets: initialTimesheets,
  isReadOnly = false,
  onRefresh,
}: {
  user: user;
  work_items: WorkItem[];
  timesheets: UserTimesheet[];
  isReadOnly?: boolean;
  onRefresh?: () => void;
}) {
  const [month, setMonth] = useState("current");
  const [project, setProject] = useState("all");
  const [editEntry, setEditEntry] = useState<UserTimesheet | null>(null);
  const [timesheets, setTimesheets] = useState(initialTimesheets);
  const { deleteTimesheet, fetchTimesheets, loading } = useTimesheetApi();

  const handleDelete = async (id: string) => {
    try {
      await deleteTimesheet(id);
      if (onRefresh) {
        onRefresh();
      } else {
        // Refresh internally if no onRefresh prop provided
        try {
          const updatedTimesheets = await fetchTimesheets();
          if (updatedTimesheets && Array.isArray(updatedTimesheets)) {
            setTimesheets(updatedTimesheets);
          }
        } catch (error) {
          console.error("Error refreshing timesheets:", error);
        }
      }
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Refresh internally if no onRefresh prop provided
      try {
        const updatedTimesheets = await fetchTimesheets();
        if (updatedTimesheets && Array.isArray(updatedTimesheets)) {
          setTimesheets(updatedTimesheets);
        }
      } catch (error) {
        console.error("Error refreshing timesheets:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
            <h3 className="text-lg font-medium">Ore Registrate</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleziona mese" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Mese Corrente</SelectItem>
                  <SelectItem value="previous">Mese Precedente</SelectItem>
                  <SelectItem value="all">Tutti</SelectItem>
                </SelectContent>
              </Select>

              <Select value={project} onValueChange={setProject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleziona progetto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i progetti</SelectItem>
                  {work_items?.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Progetto</TableHead>
                  <TableHead>Ore</TableHead>
                  <TableHead>Descrizione</TableHead>
                  {!isReadOnly && (
                    <TableHead className="text-right">Azioni</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheets?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isReadOnly ? 4 : 5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nessuna registrazione trovata
                    </TableCell>
                  </TableRow>
                ) : (
                  timesheets?.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        {
                          work_items?.find((w) => w.id === entry.work_item_id)
                            ?.title
                        }
                      </TableCell>
                      <TableCell>{entry.hours}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {entry.description}
                      </TableCell>
                      {!isReadOnly && (
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditEntry(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Conferma eliminazione
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Sei sicuro di voler eliminare questa
                                    registrazione? Questa azione non può essere
                                    annullata.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(entry.id)}
                                    disabled={loading}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {loading ? "Eliminazione..." : "Elimina"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editEntry && (
        <AddHoursDialog
          open={!!editEntry}
          onOpenChange={(open) => !open && setEditEntry(null)}
          editData={editEntry}
          user={user}
          onClose={() => {
            setEditEntry(null);
            handleRefresh();
          }}
        />
      )}
    </motion.div>
  );
}
