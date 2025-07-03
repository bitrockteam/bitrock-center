import { Badge } from "@/components/ui/badge";
import { PermitStatus, ProjectStatus, Role } from "../db";

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

export const getRoleBadge = (role: Role) => {
  switch (role) {
    case Role.Super_Admin:
      return <Badge className="bg-blue-900 text-white">Super Admin</Badge>;
    case Role.Admin:
      return <Badge className="bg-violet-700 text-white">Admin</Badge>;
    case Role.Key_Client:
      return <Badge className="bg-pink-500 text-white">Key Client</Badge>;
    case Role.Manager:
      return <Badge className="bg-purple-500 text-white">Manager</Badge>;
    default:
      return <Badge className="bg-blue-500 text-white">Employee</Badge>;
  }
};

export function getGoalBadge(
  status: "not-started" | "in-progress" | "completed",
) {
  switch (status) {
    case "not-started":
      return <Badge className="bg-gray-500 text-white">Non Iniziato</Badge>;
    case "in-progress":
      return <Badge className="bg-yellow-500 text-white">In Corso</Badge>;
    case "completed":
      return <Badge className="bg-green-500 text-white">Completato</Badge>;
    default:
      return <Badge className="bg-gray-300 text-black">Sconosciuto</Badge>;
  }
}

export const getWorkItemStatusBadge = (status: string) => {
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

export const getWorkItemTypeBadge = (type: string) => {
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
