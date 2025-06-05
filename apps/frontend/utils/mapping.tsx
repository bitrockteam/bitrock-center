import { Badge } from "@/components/ui/badge";
import { PermitStatus } from "@bitrock/db";

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
