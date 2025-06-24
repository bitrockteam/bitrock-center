"use client";

import { useGetPermitsByUser } from "@/api/useGetPermitsByUser";
import { useGetUsers } from "@/api/useGetUsers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusBadge } from "@/utils/mapping";
import { PermitType } from "@bitrock/db";
import { motion } from "framer-motion";

export default function PermitHistoryTable() {
  const { permits, isLoading } = useGetPermitsByUser();
  const { users } = useGetUsers();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case PermitType.VACATION:
        return "Ferie";
      case PermitType.PERMISSION:
        return "Permesso";
      case PermitType.SICKNESS:
        return "Malattia";
      default:
        return type;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Storico Permessi</CardTitle>
          <CardDescription>Le tue richieste di permesso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ore</TableHead>
                  <TableHead>Motivazione</TableHead>
                  <TableHead>Responsabile</TableHead>
                  <TableHead>Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || permits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      {isLoading
                        ? "Caricamento..."
                        : "Nessuna richiesta trovata"}
                    </TableCell>
                  </TableRow>
                ) : (
                  permits.map((permit, index) => (
                    <TableRow key={index}>
                      <TableCell>{getTypeLabel(permit.type)}</TableCell>
                      <TableCell>
                        {new Date(permit.date).toLocaleDateString()}{" "}
                      </TableCell>
                      <TableCell>{Number(permit.duration)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {permit.description}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {
                          users.find((user) => user.id === permit.reviewer_id)
                            ?.name
                        }
                      </TableCell>
                      <TableCell>{getStatusBadge(permit.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
