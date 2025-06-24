import { Badge } from "@/components/ui/badge";
import { PermitStatus, ProjectStatus } from "@bitrock/db";

export const getStatusBadge = (status: PermitStatus) => {
  switch (status) {
    case PermitStatus.APPROVED:
      return <Badge className="bg-green-500">Approvato</Badge>;
    case PermitStatus.PENDING:
      return <Badge variant="outline">In attesa</Badge>;
    case PermitStatus.REJECTED:
      return <Badge variant="destructive">Rifiutato</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const getProjectStatusBadge = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.ACTIVE:
      return <Badge className="bg-green-500">Attivo</Badge>;
    case ProjectStatus.COMPLETED:
      return <Badge variant="outline">Completato</Badge>;
    case ProjectStatus.PAUSED:
      return <Badge variant="secondary">In Pausa</Badge>;
    case ProjectStatus.PLANNED:
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-500">
          Pianificato
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
