"use client";

import { PermitByReviewer } from "@/app/server-actions/permit/getPermitsByReviewer";
import { updatePermitStatus } from "@/app/server-actions/permit/updatePermitStatus";
import { Button } from "@/components/ui/button";
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
import { PermitStatus, PermitType } from "@/db";
import { getStatusBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function PermitApprovalTable({
  permits,
}: {
  permits: PermitByReviewer[];
}) {
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
    await updatePermitStatus(permitId, PermitStatus.APPROVED);
    toast.success("Permesso approvato");
  };

  const rejectPermit = async (permitId: string) => {
    await updatePermitStatus(permitId, PermitStatus.REJECTED);
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
                {permits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nessuna richiesta trovata
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
                        {permit.user_permit_user_idTouser.name}
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
