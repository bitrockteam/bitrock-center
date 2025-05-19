"use client";

import { motion } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { useGetPermitsByReviewer } from "@/api/useGetPermitsByReviewer";
import { useChangePermitStatus } from "@/api/useChangePermitStatus";
import { useGetUsers } from "@/api/useGetUsers";
import { toast } from "sonner";

export default function PermitApprovalTable() {
  const { user } = useAuth();
  const { permits, isLoading, refetch } = useGetPermitsByReviewer(user!.id);
  const { changeStatus } = useChangePermitStatus();
  const { users } = useGetUsers();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approvato</Badge>;
      case "pending":
        return <Badge variant="outline">In attesa</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rifiutato</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vacation":
        return "Ferie";
      case "permission":
        return "Permesso";
      case "sickness":
        return "Malattia";
      default:
        return type;
    }
  };

  const approvePermit = async (permitId: string) => {
    changeStatus(permitId, "approved");
    refetch();
    toast.success("Permesso approvato");
  };

  const rejectPermit = async (permitId: string) => {
    changeStatus(permitId, "rejected");
    refetch();
    toast.success("Permesso rigettato");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Approva/Rigetti Permessi</CardTitle>
          <CardDescription>Permessi da Approvare/Rigettare</CardDescription>
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
                  <TableHead>Richiedente</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
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
                        {new Date(permit.startDate).toLocaleDateString()}{" "}
                        {permit.endDate &&
                          `- ${new Date(permit.endDate).toLocaleDateString()}`}
                      </TableCell>
                      <TableCell>{permit.duration}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {permit.description}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {users?.find((user) => user.id === permit.userId)?.name}
                      </TableCell>
                      <TableCell>{getStatusBadge(permit.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button onClick={() => approvePermit(permit.id)}>
                          Approva
                        </Button>
                        <Button onClick={() => rejectPermit(permit.id)}>
                          Respingi
                        </Button>
                      </TableCell>
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
