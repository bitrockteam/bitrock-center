import type { Metadata } from "next";
import PermitContainer from "@/components/permits/permit-container";
import PermitHeader from "@/components/permits/permit-header";
import { Permissions } from "@/db";
import { hasPermission } from "@/services/users/server.utils";
import PermitApproval from "./permit-approval";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ferie e Permessi | Bitrock Hours",
  description: "Gestione delle richieste di ferie e permessi",
};

export default async function LeavePage() {
  const CAN_APPROVE_PERMIT = await hasPermission(Permissions.CAN_APPROVE_PERMIT);

  return (
    <div className="space-y-6">
      <PermitHeader />
      <PermitContainer />
      {CAN_APPROVE_PERMIT && <PermitApproval />}
    </div>
  );
}
