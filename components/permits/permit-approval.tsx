"use client";

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
import { PermitStatus, PermitType } from "@/db";
import { useApi } from "@/hooks/useApi";
import { getStatusBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";

type PermitByReviewer = {
  id: string;
  type: PermitType;
  date: Date;
  duration: number;
  description: string | null;
  status: PermitStatus;
  user_permit_user_idTouser: {
    id: string;
    name: string;
  };
};

export default function PermitApprovalTable() {
  const { data: permits, loading, error, callApi } = useApi<PermitByReviewer[]>();

  useEffect(() => {
    callApi("/api/permit/get-permits-by-reviewer");
  }, [callApi]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }
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

  const approvePermit = async (permitId: string) => {
    try {
      await callApi("/api/permit/update-permit-status", {
        method: "PUT",
        body: JSON.stringify({ permitId, status: PermitStatus.APPROVED }),
      });
      toast.success("Permesso approvato");
      // Refresh the data
      callApi("/api/permit/get-permits-by-reviewer");
    } catch {
      toast.error("Errore nell'approvazione del permesso");
    }
  };

  const rejectPermit = async (permitId: string) => {
    try {
      await callApi("/api/permit/update-permit-status", {
        method: "PUT",
        body: JSON.stringify({ permitId, status: PermitStatus.REJECTED }),
      });
      toast.success("Permesso rigettato");
      // Refresh the data
      callApi("/api/permit/get-permits-by-reviewer");
    } catch {
      toast.error("Errore nel rigetto del permesso");
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
                {!permits || permits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nessuna richiesta trovata
                    </TableCell>
                  </TableRow>
                ) : (
                  permits.map((permit) => (
                    <TableRow key={permit.id}>
                      <TableCell>{getTypeLabel(permit.type)}</TableCell>
                      <TableCell>{new Date(permit.date).toLocaleDateString()} </TableCell>
                      <TableCell>{Number(permit.duration)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{permit.description}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {permit.user_permit_user_idTouser.name}
                      </TableCell>
                      <TableCell>{getStatusBadge(permit.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button onClick={() => approvePermit(permit.id)}>Approva</Button>
                        <Button onClick={() => rejectPermit(permit.id)}>Respingi</Button>
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
