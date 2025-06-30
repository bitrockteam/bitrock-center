"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { contract, contractstatus, contracttype } from "@bitrock/db";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  FileText,
  MapPin,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import CloseContractDialog from "./close-contract-dialog";
import EditContractDialog from "./edit-contract-dialog";

export default function ContractDetail({
  contract,
  canView,
  canEdit,
}: {
  contract: contract | null | undefined;
  canView?: boolean;
  canEdit?: boolean;
}) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contratto</CardTitle>
          <CardDescription>
            Informazioni contrattuali non disponibili
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nessun contratto trovato per questo dipendente
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!canView) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contratto</CardTitle>
          <CardDescription>Accesso non autorizzato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <p className="text-muted-foreground text-center">
              Non hai i permessi per visualizzare le informazioni contrattuali
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case "permanent":
        return "Tempo Indeterminato";
      case "fixed-term":
        return "Tempo Determinato";
      case "freelancer":
        return "Freelancer";
      default:
        return type;
    }
  };

  const getWorkingHoursLabel = (hours: string) => {
    switch (hours) {
      case "full-time":
        return "Full-time";
      case "part-time":
        return "Part-time";
      case "custom":
        return "Personalizzato";
      default:
        return hours;
    }
  };

  const getRemotePolicyLabel = (policy: string) => {
    switch (policy) {
      case "full-remote":
        return "Full Remote";
      case "hybrid":
        return "Ibrido";
      case "on-site":
        return "In Sede";
      default:
        return policy;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informazioni Contrattuali
              </CardTitle>
              <CardDescription>
                Dettagli del contratto di lavoro
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={contract.status === "active" ? "default" : "secondary"}
                className={
                  contract.status === "active" ? "bg-green-600" : "bg-gray-600"
                }
              >
                {contract.status === "active" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {contract.status === "active" ? "Attivo" : "Non Attivo"}
              </Badge>
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifica Contratto
                  </Button>
                  {contract.status === "active" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowCloseDialog(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Chiudi Contratto
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                RAL Annuale
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(contract.ral)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <Building className="h-4 w-4 mr-2" />
                Tipo Contratto
              </div>
              <div className="text-lg font-semibold">
                {getContractTypeLabel(contract.contract_type)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Orario di Lavoro
              </div>
              <div className="text-lg font-semibold">
                {getWorkingHoursLabel(contract.working_hours)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Modalità Lavoro
              </div>
              <div className="text-lg font-semibold">
                {getRemotePolicyLabel(contract.remote_policy)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contract Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dettagli Temporali</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div className="flex items-center text-sm font-medium">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Data Inizio
                  </div>
                  <div className="text-sm">
                    {formatDate(contract.start_date.toDateString())}
                  </div>
                </div>

                {contract.end_date && (
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center text-sm font-medium">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      Data Fine
                    </div>
                    <div className="text-sm">
                      {formatDate(contract.end_date.toDateString())}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center text-sm font-medium">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Ultima Modifica
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(contract.last_modified.toDateString())}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Note Aggiuntive</h3>

              <div className="bg-muted/30 rounded-lg p-4 min-h-[120px]">
                {contract.notes ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {contract.notes}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nessuna nota aggiuntiva
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contract Status Information */}
          {contract.status === contractstatus.not_active && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h4 className="font-semibold text-destructive">
                  Contratto Chiuso
                </h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Questo contratto è stato chiuso il{" "}
                {contract.end_date &&
                  formatDate(contract.end_date.toDateString())}
                . Il dipendente non può più essere assegnato a nuovi progetti.
              </p>
            </div>
          )}

          {/* Contract Type Specific Information */}
          {contract.contract_type === contracttype.fixed_term &&
            !contract.end_date && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                    Contratto a Tempo Determinato
                  </h4>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Ricorda di impostare una data di fine per questo contratto a
                  tempo determinato.
                </p>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Edit Contract Dialog */}
      {contract && (
        <EditContractDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          contract={contract}
          employeeId={contract.employee_id}
        />
      )}

      {/* Close Contract Dialog */}
      <CloseContractDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        contract={contract}
        employeeId={contract.employee_id}
      />
    </motion.div>
  );
}
